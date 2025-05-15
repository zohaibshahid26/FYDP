"""
RAG Service Module
Handles vector embeddings, document retrieval, and processing the mental health Q&A dataset
"""

import os
import re
import logging
from typing import List, Dict, Any, Optional
import pandas as pd
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Path to the conversation dataset
DATASET_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data.csv")
CACHE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "vector_cache")
os.makedirs(CACHE_DIR, exist_ok=True)

# Initialize RAG components
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2") # Using a better model
vector_store = None

def extract_topics(question: str, answer: str) -> List[str]:
    """
    Extract relevant topics or keywords from the Q&A
    Enhanced with more comprehensive topic detection
    
    Args:
        question (str): The question text
        answer (str): The answer text
        
    Returns:
        List[str]: List of identified topics
    """
    topics = []
    
    # Check for mental health conditions
    mental_health_conditions = {
        "depression": ["depression", "depressive", "mdd", "sad", "low mood"],
        "anxiety": ["anxiety", "anxious", "worry", "panic", "gad", "phobia"],
        "bipolar": ["bipolar", "mania", "manic", "mood swing"],
        "schizophrenia": ["schizophrenia", "psychosis", "psychotic", "hallucination", "delusion"],
        "addiction": ["addiction", "substance", "alcohol", "drug abuse"],
        "adhd": ["adhd", "attention deficit", "hyperactive", "inattentive"],
        "trauma": ["trauma", "ptsd", "abuse"],
        "personality disorder": ["personality disorder", "borderline", "narcissistic"],
        "ocd": ["ocd", "obsessive", "compulsive"],
        "eating disorder": ["eating disorder", "anorexia", "bulimia", "binge"]
    }
    
    combined_text = (question + " " + answer).lower()
    
    # Check for each condition in the text
    for condition, keywords in mental_health_conditions.items():
        if any(keyword in combined_text for keyword in keywords):
            topics.append(condition)
    
    # Check for treatment categories
    treatment_categories = {
        "therapy": ["therapy", "psychotherapy", "counseling", "cbt", "dbt"],
        "medication": ["medication", "medicine", "antidepressant", "ssri", "drug"],
        "self-help": ["self-help", "coping", "exercise", "meditation", "mindfulness"],
        "diagnosis": ["diagnosis", "assessment", "test", "symptom", "sign"]
    }
    
    for category, keywords in treatment_categories.items():
        if any(keyword in combined_text for keyword in keywords):
            topics.append(category)
    
    # If no specific topics found, add a general category
    if not topics:
        topics.append("mental health general")
        
    return topics

def preprocess_text(text: str) -> str:
    """
    Clean and standardize text for better matching
    
    Args:
        text (str): Input text to preprocess
        
    Returns:
        str: Clean, standardized text
    """
    if not text:
        return ""
    
    # Lowercase
    text = text.lower()
    
    # Remove special characters
    text = re.sub(r'[^\w\s]', ' ', text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def load_conversation_dataset() -> bool:
    """
    Load and process the mental health Q&A dataset
    
    Returns:
        bool: True if successful, False otherwise
    """
    global vector_store
    
    # Check if we have a cached vector store
    vector_cache_path = os.path.join(CACHE_DIR, "faiss_index")
    
    # Try to load from cache first
    if os.path.exists(vector_cache_path):
        try:
            logger.info("Loading vector store from cache...")
            vector_store = FAISS.load_local(vector_cache_path, embeddings)
            logger.info("Vector store loaded successfully from cache")
            return True
        except Exception as e:
            logger.warning(f"Failed to load vector store from cache: {str(e)}")
    
    try:
        # Load dataset
        logger.info(f"Loading mental health dataset from {DATASET_PATH}")
        df = pd.read_csv(DATASET_PATH)
        
        logger.info(f"Dataset loaded with {len(df)} entries")
        
        # Process Q&A pairs and prepare documents for embedding
        documents = []
        for _, row in df.iterrows():
            question = row.get('Questions', '')
            answer = row.get('Answers', '')
            question_id = row.get('Question_ID', '')
            
            # Skip empty entries
            if not question or not answer:
                continue
            
            # Clean question and answer
            clean_question = preprocess_text(question)
            clean_answer = preprocess_text(answer)
                
            # Create document with content and metadata
            document = {
                'content': f"Question: {question}\nAnswer: {answer}",
                'metadata': {
                    'question_id': str(question_id),
                    'question': question,
                    'clean_question': clean_question,
                    'topics': extract_topics(question, answer)
                }
            }
            documents.append(document)
            
        logger.info(f"Processed {len(documents)} valid documents")
            
        # Split documents
        texts = [doc['content'] for doc in documents]
        metadatas = [doc['metadata'] for doc in documents]
        
        # Create text chunks
        chunks = text_splitter.create_documents(texts, metadatas=metadatas)
        logger.info(f"Created {len(chunks)} text chunks")
        
        # Create vector store
        vector_store = FAISS.from_documents(chunks, embeddings)
        
        # Save to cache
        try:
            vector_store.save_local(vector_cache_path)
            logger.info(f"Vector store saved to cache at {vector_cache_path}")
        except Exception as e:
            logger.warning(f"Failed to save vector store to cache: {str(e)}")
        
        logger.info(f"Successfully loaded {len(documents)} mental health Q&A pairs into the vector store")
        return True
        
    except Exception as e:
        logger.error(f"Error loading mental health dataset: {str(e)}")
        return False

def retrieve_similar_content(query: str, emotion: Optional[str] = None, k: int = 3) -> List[Dict[str, Any]]:
    """
    Retrieve relevant mental health information based on the query
    
    Args:
        query (str): The query text
        emotion (str, optional): Emotion to use in search context
        k (int): Number of results to return
        
    Returns:
        List[Dict]: List of relevant content with metadata
    """
    if vector_store is None:
        logger.warning("Vector store not initialized. Loading dataset...")
        if not load_conversation_dataset():
            return []
    
    try:
        # Enhance query with emotion context if available
        enhanced_query = query
        if emotion and emotion.lower() not in ["unknown", "neutral"]:
            enhanced_query = f"{query} related to {emotion} emotion"
        
        logger.info(f"Searching for: '{enhanced_query}'")
        
        # Expand search results to find more candidates then filter down
        search_k = min(k * 2, 10)  # Get more results than needed to improve relevance filtering
        
        # Search for similar content
        docs = vector_store.similarity_search(enhanced_query, k=search_k)
        
        # Process and rank results
        results = []
        for doc in docs:
            # Extract content and metadata
            content = doc.page_content
            metadata = doc.metadata
            
            # Calculate relevance based on keyword overlap
            query_terms = set(preprocess_text(enhanced_query).split())
            content_terms = set(preprocess_text(content).split())
            relevance = len(query_terms.intersection(content_terms)) / len(query_terms) if query_terms else 0
            
            results.append({
                'content': content,
                'metadata': metadata,
                'relevance': relevance
            })
        
        # Sort by relevance and take top k
        results.sort(key=lambda x: x['relevance'], reverse=True)
        results = results[:k]
        
        logger.info(f"Retrieved {len(results)} relevant documents")
        return results
        
    except Exception as e:
        logger.error(f"Error retrieving similar content: {str(e)}")
        return []
