"""
Report Service Module
Handles generation of PDF reports for analysis and treatment plans
"""

import io
import logging
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants for the report
PROJECT_NAME = "EALTH - AI Based Health Monitoring System"

def generate_pdf_report(report_type, report_data):
    """
    Generate a PDF report based on the provided data
    
    Args:
        report_type (str): Type of report - 'analysis' or 'treatment'
        report_data (dict): Report data to include in the PDF
        
    Returns:
        BytesIO: PDF file buffer
    """
    buffer = io.BytesIO()
    
    # Create the PDF document with proper margins
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=54,  # Reduced margins for more space
        leftMargin=54,
        topMargin=72,
        bottomMargin=72,
        title=f"{PROJECT_NAME} - {'Mental Health Assessment' if report_type == 'analysis' else 'Treatment Plan'}"
    )
    
    # Get styles - fix for "Style already defined" error
    styles = getSampleStyleSheet()
    
    # Define all custom styles needed for professional medical reports
    title_style = styles['Title']
    title_style.fontName = 'Helvetica-Bold'
    title_style.fontSize = 20
    title_style.alignment = TA_CENTER
    title_style.spaceAfter = 6
    
    # Create custom styles with unique names
    styles.add(ParagraphStyle(
        name='ProjectName',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#2a5885"),
        spaceAfter=12
    ))
    
    styles.add(ParagraphStyle(
        name='ReportDate',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        alignment=TA_CENTER,
        textColor=colors.grey,
        spaceAfter=24
    ))
    
    styles.add(ParagraphStyle(
        name='SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#2a5885"),
        spaceAfter=6,
        spaceBefore=12,
        borderWidth=0,
        borderColor=colors.HexColor("#2a5885"),
        borderPadding=(0, 0, 0, 4),
        borderRadius=None,
    ))
    
    styles.add(ParagraphStyle(
        name='SubsectionHeader',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=12,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#2a5885"),
        spaceAfter=4,
        spaceBefore=8
    ))
    
    styles.add(ParagraphStyle(
        name='NormalText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        alignment=TA_JUSTIFY,  # Justified text looks more professional
        spaceBefore=4,
        spaceAfter=4,
        leading=14  # Increased line spacing for better readability
    ))
    
    styles.add(ParagraphStyle(
        name='BulletItem',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        alignment=TA_LEFT,
        leftIndent=20,
        firstLineIndent=-12,
        spaceBefore=2,
        spaceAfter=2,
        leading=14
    ))
    
    styles.add(ParagraphStyle(
        name='Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.grey,
        alignment=TA_CENTER
    ))
    
    # Create story (content) for the document
    story = []
    
    # Choose the right report generator based on type
    if report_type == 'analysis':
        _generate_analysis_report(story, styles, report_data)
    elif report_type == 'treatment':
        _generate_treatment_report(story, styles, report_data)
    else:
        logger.error(f"Unknown report type: {report_type}")
        story.append(Paragraph(f"Unknown report type: {report_type}", styles['NormalText']))
    
    # Build the document
    doc.build(story)
    buffer.seek(0)
    
    return buffer

def _generate_analysis_report(story, styles, analysis_data):
    """Generate a mental health analysis report"""
    # Add report header with professional styling
    story.append(Paragraph("MENTAL HEALTH ASSESSMENT REPORT", styles['Title']))
    story.append(Paragraph(PROJECT_NAME, styles['ProjectName']))
    
    # Add subtitle with date
    report_date = datetime.now().strftime("%B %d, %Y")
    story.append(Paragraph(f"Report Generated: {report_date}", styles['ReportDate']))
    
    # Add horizontal separator
    story.append(Spacer(1, 0.05*inch))
    tbl = Table([[""], [""]], colWidths=[7*inch], rowHeights=[0.5, 0.5])
    tbl.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, 0), 1, colors.HexColor("#2a5885")),
        ('LINEBELOW', (0, 1), (-1, 1), 0.5, colors.HexColor("#2a5885")),
    ]))
    story.append(tbl)
    story.append(Spacer(1, 0.1*inch))
    
    # Add patient information section with better styling
    story.append(Paragraph("Patient Information", styles['SectionHeader']))
    
    # Get patient info
    patient_info = analysis_data.get('patient_information', {})
    patient_name = patient_info.get('name', 'Not specified')
    patient_age = patient_info.get('age', 'Not specified')
    patient_gender = patient_info.get('gender', 'Not specified')
    
    # Create patient info table with better styling
    patient_data = [
        ["Name:", patient_name],
        ["Age:", patient_age],
        ["Gender:", patient_gender],
        ["Assessment Date:", report_date],
    ]
    
    patient_table = Table(patient_data, colWidths=[1.5*inch, 5*inch])
    patient_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#f2f6fc")),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor("#2a5885")),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.grey),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(patient_table)
    story.append(Spacer(1, 0.2*inch))
    
    # Add primary assessment section with better styling
    story.append(Paragraph("Assessment Summary", styles['SectionHeader']))
    
    # Primary condition details
    condition = analysis_data.get('condition', 'Not specified')
    severity = analysis_data.get('severity', 'Not specified')
    risk = analysis_data.get('risk_assessment', 'Not specified')
    
    # Fix text overflow by setting smaller font size and wrapping for condition
    condition_style = ParagraphStyle(
        name='ConditionText',
        parent=styles['NormalText'],
        fontSize=9,
        wordWrap='CJK'
    )
    
    # Format the condition as a paragraph to allow wrapping
    condition_paragraph = Paragraph(condition, condition_style)
    
    # Add better explanations with color indicators for severity and risk
    severity_indicators = {
        'mild': ('Mild', colors.HexColor("#fff9e6"), "Patient exhibits minor symptoms with minimal impairment to daily functioning."),
        'moderate': ('Moderate', colors.HexColor("#fff0e6"), "Patient exhibits significant symptoms with moderate impairment to daily functioning."),
        'severe': ('Severe', colors.HexColor("#ffe6e6"), "Patient exhibits severe symptoms with substantial impairment to daily functioning.")
    }
    
    risk_indicators = {
        'low': ('Low Risk', colors.HexColor("#e6ffe6"), "Patient shows minimal risk factors with good support systems."),
        'moderate': ('Moderate Risk', colors.HexColor("#fff9e6"), "Patient shows some concerning risk factors requiring periodic monitoring."),
        'high': ('High Risk', colors.HexColor("#ffe6e6"), "Patient shows significant risk factors requiring immediate attention and intervention.")
    }
    
    # Determine correct severity and risk levels based on text
    severity_level = next((level for level in severity_indicators if level in severity.lower()), None)
    risk_level = next((level for level in risk_indicators if level in risk.lower()), None)
    
    severity_text = severity
    severity_desc = ""
    severity_bg_color = colors.white
    if severity_level:
        severity_text = severity_indicators[severity_level][0]
        severity_bg_color = severity_indicators[severity_level][1]
        severity_desc = severity_indicators[severity_level][2]
    
    risk_text = risk
    risk_desc = ""
    risk_bg_color = colors.white
    if risk_level:
        risk_text = risk_indicators[risk_level][0]
        risk_bg_color = risk_indicators[risk_level][1]
        risk_desc = risk_indicators[risk_level][2]
    
    # Create condition table with better formatting for wrapping
    condition_data = [
        ["Primary Condition:", [condition_paragraph]],
        ["Severity:", [Paragraph(f"{severity_text}", styles['NormalText']), 
                     Paragraph(f"<i>{severity_desc}</i>", ParagraphStyle('small', parent=styles['NormalText'], fontSize=8))]],
        ["Risk Assessment:", [Paragraph(f"{risk_text}", styles['NormalText']),
                           Paragraph(f"<i>{risk_desc}</i>", ParagraphStyle('small', parent=styles['NormalText'], fontSize=8))]],
    ]
    
    # Use a layout that ensures proper text wrapping
    condition_table = Table(condition_data, colWidths=[1.5*inch, 5*inch])        
    condition_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#f2f6fc")),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor("#2a5885")),
        ('BACKGROUND', (1, 1), (1, 1), severity_bg_color),  # Color for severity
        ('BACKGROUND', (1, 2), (1, 2), risk_bg_color),      # Color for risk
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),  # Changed to TOP alignment for multiline content
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.grey),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (1, 0), (1, -1), 10),  # Extra padding on left side of content column
    ]))
    story.append(condition_table)
    story.append(Spacer(1, 0.2*inch))
    
    # Mental health assessment section with better formatting
    story.append(Paragraph("Mental Health Assessment", styles['SectionHeader']))
    mental_health_assessment = analysis_data.get('mental_health_assessment', 'Not provided')
    story.append(_format_text_with_bullets(mental_health_assessment, styles))
    story.append(Spacer(1, 0.2*inch))
    
    # Differential diagnosis with better formatting
    story.append(Paragraph("Differential Diagnosis", styles['SectionHeader']))
    differential_diagnosis = analysis_data.get('differential_diagnosis', 'Not provided')
    story.append(_format_text_with_bullets(differential_diagnosis, styles))
    story.append(Spacer(1, 0.2*inch))
    
    # Prognosis with better formatting
    story.append(Paragraph("Prognosis", styles['SectionHeader']))
    prognosis = analysis_data.get('prognosis', 'Not provided')
    story.append(_format_text_with_bullets(prognosis, styles))
    story.append(Spacer(1, 0.2*inch))
    
    # Add a page break before recommendations
    story.append(PageBreak())
    
    # Treatment recommendations
    story.append(Paragraph("Treatment Recommendations", styles['SectionHeader']))
    recommendations = analysis_data.get('recommendations', [])
    
    if recommendations:
        for i, rec in enumerate(recommendations):
            # Use bullet points for better formatting
            bullet_text = f"• {rec}"
            story.append(Paragraph(bullet_text, styles['BulletItem']))
            
            # Add a small gap between bullet points
            if i < len(recommendations) - 1:
                story.append(Spacer(1, 0.05*inch))
    else:
        story.append(Paragraph("No specific recommendations provided.", styles['NormalText']))
    
    story.append(Spacer(1, 0.2*inch))
    
    # Therapy options with improved formatting
    story.append(Paragraph("Therapy Options", styles['SectionHeader']))
    therapy_options = analysis_data.get('therapy_options', [])
    
    if therapy_options:
        # Create formatted list of therapy options with HTML
        therapy_html = ""
        
        for i, therapy in enumerate(therapy_options):
            description = ""
            
            # Try to match with known therapy descriptions
            for key_term, desc in {
                "cognitive behavioral therapy": "Focuses on identifying and changing negative thought patterns and behaviors.",
                "dialectical behavior therapy": "Combines cognitive techniques with mindfulness to help regulate emotions and improve relationships.",
                "interpersonal therapy": "Addresses interpersonal issues and relationship patterns that contribute to psychological distress.",
                "psychodynamic therapy": "Explores unconscious processes and past experiences to understand current behaviors and relationships.",
                "exposure therapy": "Gradually exposes individuals to anxiety-provoking stimuli to reduce fear response.",
                "mindfulness-based": "Incorporates meditation practices to develop awareness and acceptance of present experiences.",
                "acceptance and commitment": "Focuses on accepting uncomfortable thoughts and feelings while committing to behavior changes.",
                "group therapy": "Provides support, perspective, and accountability through shared experiences with peers.",
                "family therapy": "Addresses family dynamics and communication patterns that may contribute to individual distress."
            }.items():
                if key_term.lower() in therapy.lower():
                    description = desc
                    break
            
            # Add therapy option with any description
            therapy_html += f"• <b>{therapy}</b>"
            if description:
                therapy_html += f" - <i>{description}</i>"
            
            if i < len(therapy_options) - 1:
                therapy_html += "<br/><br/>"
        
        # Create a single paragraph with all therapy options
        story.append(Paragraph(therapy_html, styles['NormalText']))
    else:
        story.append(Paragraph("No specific therapy options provided.", styles['NormalText']))
    
    story.append(Spacer(1, 0.2*inch))
    
    # Medication considerations with enhanced formatting
    medication_considerations = analysis_data.get('medication_considerations', [])
    
    if medication_considerations:
        story.append(Paragraph("Medication Considerations", styles['SectionHeader']))
        
        # Build a single paragraph with all medications formatted with HTML
        med_html = ""
        
        for i, med in enumerate(medication_considerations):
            # Try to split medication from any notes (if formatted with a colon or dash)
            med_parts = med.split(':', 1) if ':' in med else med.split(' - ', 1)
            
            if len(med_parts) > 1:
                med_name = med_parts[0].strip()
                med_notes = med_parts[1].strip()
                med_html += f"• <b>{med_name}</b> - {med_notes}"
            else:
                med_html += f"• {med}"
                
            if i < len(medication_considerations) - 1:
                med_html += "<br/><br/>"
        
        story.append(Paragraph(med_html, styles['NormalText']))
        
        # Add medication disclaimer
        story.append(Spacer(1, 0.1*inch))
        med_disclaimer = Paragraph("<i>Note: Medication options should always be discussed with a psychiatrist. " +
                            "These considerations are based on the presented symptoms and should not be " +
                            "taken as definitive prescriptions.</i>", ParagraphStyle('MedDisclaimer', 
                                                                                     parent=styles['NormalText'], 
                                                                                     fontSize=8,
                                                                                     textColor=colors.gray))
        story.append(med_disclaimer)
    
    story.append(Spacer(1, 0.2*inch))
    
    # Add disclaimer and footer - fixed layout
    story.append(Spacer(1, 0.5*inch))
    
    # Improved disclaimer box with fixed layout
    disclaimer_title = Paragraph("<b>DISCLAIMER</b>", styles['SubsectionHeader'])
    story.append(disclaimer_title)
    
    disclaimer_text = Paragraph(
        "This report is generated by an AI system and should be reviewed by a qualified healthcare professional. "
        "This document does not constitute medical advice and is intended for informational purposes only.",
        ParagraphStyle(
            'DisclaimerText',
            parent=styles['NormalText'],
            fontSize=8,
            textColor=colors.black,
            borderWidth=1,
            borderColor=colors.grey,
            borderPadding=6,
            borderRadius=3,
            backColor=colors.HexColor("#f2f6fc")
        )
    )
    story.append(disclaimer_text)
    
    # Final footer with better spacing
    story.append(Spacer(1, 0.2*inch))
    
    footer_text = f"{PROJECT_NAME} • Report ID: {hash(str(analysis_data)[:20]) % 10000:04d} • Page: "
    story.append(Paragraph(footer_text, styles['Footer']))
    story.append(Paragraph("Always consult with a qualified healthcare professional for medical advice.", styles['Footer']))

def _format_text_with_bullets(text, styles):
    """Convert plain text into bullet points where appropriate"""
    if not text or text == 'Not provided':
        return Paragraph("Not provided", styles['NormalText'])
    
    # Check if the text already has bullet points or numbered lists
    if any(line.strip().startswith(('• ', '* ', '- ', '1. ', '2. ')) for line in text.split('\n')):
        # Text already has bullets, format each line
        lines = text.strip().split('\n')
        result = []
        
        for line in lines:
            line = line.strip()
            if not line:  # Skip empty lines
                continue
                
            if line.startswith(('• ', '* ', '- ')):
                # Format as bullet point
                line = "• " + line[2:].strip() 
                result.append(Paragraph(line, styles['BulletItem']))
            elif len(line) > 2 and line[0].isdigit() and line[1] == '.' and line[2] == ' ':
                # Format as numbered item
                result.append(Paragraph(line, styles['BulletItem']))
            else:
                # Regular paragraph
                result.append(Paragraph(line, styles['NormalText']))
        
        # Instead of returning a list directly, we'll return a single paragraph
        # with all the text combined with line breaks
        combined_text = "<br/>".join([p.text for p in result])
        return Paragraph(combined_text, styles['NormalText'])
    
    # Try to identify sentences that could be bullet points
    sentences = text.replace('\n', ' ').split('. ')
    if len(sentences) > 2:
        # Multiple sentences that could be formatted as bullet points
        # Convert to a single paragraph with bullets as HTML
        intro = sentences[0] + '.' if sentences[0] else ''
        bullet_points = []
        
        for sentence in sentences[1:]:
            if sentence.strip():
                bullet_text = sentence.strip()
                if not bullet_text.endswith('.'):
                    bullet_text += '.'
                bullet_points.append(f"• {bullet_text}")
        
        # Combine into HTML with line breaks
        combined_html = intro
        if bullet_points:
            if intro:
                combined_html += "<br/><br/>"
            combined_html += "<br/>".join(bullet_points)
            
        return Paragraph(combined_html, styles['NormalText'])
    
    # Default case: return as a single paragraph with justified text
    return Paragraph(text, styles['NormalText'])

def _generate_treatment_report(story, styles, treatment_data):
    """Generate a treatment plan report"""
    # Similar enhancements for the treatment report
    story.append(Paragraph("MENTAL HEALTH TREATMENT PLAN", styles['Title']))
    story.append(Paragraph(PROJECT_NAME, styles['ProjectName']))
    
    # Add subtitle with date
    report_date = datetime.now().strftime("%B %d, %Y")
    story.append(Paragraph(f"Report Generated: {report_date}", styles['ReportDate']))
    
    # Add horizontal separator
    story.append(Spacer(1, 0.05*inch))
    tbl = Table([[""], [""]], colWidths=[7*inch], rowHeights=[0.5, 0.5])
    tbl.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, 0), 1, colors.HexColor("#2a5885")),
        ('LINEBELOW', (0, 1), (-1, 1), 0.5, colors.HexColor("#2a5885")),
    ]))
    story.append(tbl)
    story.append(Spacer(1, 0.1*inch))
    
    # Add patient information with better styling 
    if 'prescription_title' in treatment_data:
        story.append(Paragraph(treatment_data['prescription_title'], styles['SectionHeader']))
        story.append(Spacer(1, 0.1*inch))
    
    story.append(Paragraph("Patient Information", styles['SectionHeader']))
    
    # Get patient info
    patient_info = treatment_data.get('patient_information', {})
    patient_name = patient_info.get('name', 'Not specified')
    patient_age = patient_info.get('age', 'Not specified')
    patient_gender = patient_info.get('gender', 'Not specified')
    
    # Create patient info table with better styling
    patient_data = [
        ["Name:", patient_name],
        ["Age:", patient_age],
        ["Gender:", patient_gender],
        ["Plan Date:", report_date],
    ]
    
    patient_table = Table(patient_data, colWidths=[1.5*inch, 5*inch])
    patient_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#f2f6fc")),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor("#2a5885")),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.grey),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(patient_table)
    story.append(Spacer(1, 0.2*inch))
    
    # Clinical formulation with proper wrapping
    if 'clinical_formulation' in treatment_data:
        story.append(Paragraph("Clinical Formulation", styles['SectionHeader']))
        clinical_formulation = treatment_data.get('clinical_formulation', 'Not provided')
        wrapped_formulation = Paragraph(clinical_formulation, styles['NormalText'])
        story.append(wrapped_formulation)
        story.append(Spacer(1, 0.2*inch))
    
    # Diagnosis section with improved formatting
    if 'diagnosis' in treatment_data:
        story.append(Paragraph("Diagnosis", styles['SectionHeader']))
        diagnosis = treatment_data['diagnosis']
        
        if isinstance(diagnosis, dict):
            if 'primary' in diagnosis:
                primary_text = f"<b>Primary:</b> {diagnosis['primary']}"
                story.append(Paragraph(primary_text, styles['NormalText']))
            
            if 'differential' in diagnosis:
                differential_text = f"<b>Differential:</b> {diagnosis['differential']}"
                story.append(Paragraph(differential_text, styles['NormalText']))
            
            if 'contributing_factors' in diagnosis and diagnosis['contributing_factors']:
                story.append(Paragraph("<b>Contributing Factors:</b>", styles['SubsectionHeader']))
                for factor in diagnosis['contributing_factors']:
                    bullet_text = f"• {factor}"
                    story.append(Paragraph(bullet_text, styles['BulletItem']))
        else:
            # Handle string diagnosis
            story.append(Paragraph(str(diagnosis), styles['NormalText']))
        
        story.append(Spacer(1, 0.2*inch))
    
    # Check if we need a page break
    story.append(PageBreak())
    
    # Treatment approach with improved visual design
    if 'treatment_plan' in treatment_data:
        story.append(Paragraph("Treatment Approach", styles['SectionHeader']))
        treatment_plan = treatment_data['treatment_plan']
        
        if isinstance(treatment_plan, dict):
            # Handle treatment_plan object with various components in a clean table format
            sections = [
                ('immediate_recommendations', 'Immediate Recommendations'),
                ('psychotherapy', 'Psychotherapy'),
                ('medication_considerations', 'Medication Considerations'),
                ('lifestyle_modifications', 'Lifestyle Modifications'),
                ('self_care_strategies', 'Self-Care Strategies')
            ]
            
            plan_data = []
            has_data = False
            
            for key, title in sections:
                if key in treatment_plan and treatment_plan[key]:
                    has_data = True
                    plan_data.append([
                        Paragraph(f"<b>{title}</b>", styles['SubsectionHeader']),
                        Paragraph(treatment_plan[key], styles['NormalText'])
                    ])
            
            if has_data:
                plan_table = Table(plan_data, colWidths=[2*inch, 4.5*inch])
                plan_table.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#f2f6fc")),
                    ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor("#2a5885")),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
                    ('BOX', (0, 0), (-1, -1), 0.5, colors.grey),
                    ('PADDING', (0, 0), (-1, -1), 6),
                ]))
                story.append(plan_table)
            else:
                story.append(Paragraph(str(treatment_plan), styles['NormalText']))
        else:
            # Handle string treatment_plan
            story.append(Paragraph(str(treatment_plan), styles['NormalText']))
        
        story.append(Spacer(1, 0.2*inch))
    
    # Medications with improved formatting
    if 'medications' in treatment_data and treatment_data['medications']:
        story.append(Paragraph("Medication Recommendations", styles['SectionHeader']))
        
        med_data = []
        for i, med in enumerate(treatment_data['medications']):
            med_data.append([f"{i+1}.", Paragraph(med, styles['NormalText'])])
        
        if med_data:
            med_table = Table(med_data, colWidths=[0.3*inch, 6.2*inch])
            med_table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 3),
            ]))
            story.append(med_table)
        
        # Add dosage instructions if available
        if 'dosage_instructions' in treatment_data:
            story.append(Paragraph("Dosage Instructions", styles['SubsectionHeader']))
            dosage = treatment_data['dosage_instructions']
            story.append(Paragraph(dosage, styles['NormalText']))
        
        story.append(Spacer(1, 0.2*inch))
    
    # Monitoring plan with better visualization
    if 'monitoring_plan' in treatment_data:
        story.append(Paragraph("Monitoring Plan", styles['SectionHeader']))
        monitoring = treatment_data['monitoring_plan']
        
        if isinstance(monitoring, dict):
            # Create a visually appealing table for the monitoring plan
            monitoring_rows = []
            
            if 'follow_up' in monitoring:
                monitoring_rows.append([
                    Paragraph("<b>Follow-up:</b>", styles['SubsectionHeader']),
                    Paragraph(monitoring['follow_up'], styles['NormalText'])
                ])
            
            sections = [
                ('assessment_tools', 'Assessment Tools'),
                ('warning_signs', 'Warning Signs'),
                ('treatment_milestones', 'Treatment Milestones')
            ]
            
            for key, title in sections:
                if key in monitoring and monitoring[key]:
                    content = ""
                    
                    if isinstance(monitoring[key], list):
                        for item in monitoring[key]:
                            content += f"• {item}<br/>"
                    else:
                        content = str(monitoring[key])
                    
                    monitoring_rows.append([
                        Paragraph(f"<b>{title}:</b>", styles['SubsectionHeader']),
                        Paragraph(content, styles['NormalText'])
                    ])
            
            if monitoring_rows:
                monitoring_table = Table(monitoring_rows, colWidths=[1.5*inch, 5*inch])
                monitoring_table.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#f6f8fa")),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
                    ('BOX', (0, 0), (-1, -1), 0.5, colors.grey),
                    ('PADDING', (0, 0), (-1, -1), 6),
                ]))
                story.append(monitoring_table)
        else:
            # Handle string monitoring
            story.append(Paragraph(str(monitoring), styles['NormalText']))
        
        story.append(Spacer(1, 0.2*inch))
    
    # Follow-up instructions
    elif 'follow_up_instructions' in treatment_data:
        story.append(Paragraph("Follow-up Instructions", styles['SectionHeader']))
        follow_up = treatment_data['follow_up_instructions']
        story.append(Paragraph(follow_up, styles['NormalText']))
        story.append(Spacer(1, 0.2*inch))
    
    # Additional recommendations
    if 'additional_recommendations' in treatment_data and treatment_data['additional_recommendations']:
        story.append(Paragraph("Additional Recommendations", styles['SectionHeader']))
        for rec in treatment_data['additional_recommendations']:
            bullet_text = f"• {rec}"
            story.append(Paragraph(bullet_text, styles['BulletItem']))
        story.append(Spacer(1, 0.2*inch))
    
    # Add disclaimer and footer - fixed layout
    story.append(Spacer(1, 0.5*inch))
    
    # Improved disclaimer box with fixed layout
    disclaimer_title = Paragraph("<b>DISCLAIMER</b>", styles['SubsectionHeader'])
    story.append(disclaimer_title)
    
    disclaimer_text = Paragraph(
        "This treatment plan is generated by an AI system and should be reviewed by a qualified healthcare professional. "
        "This document does not constitute medical advice and requires professional validation before implementation.",
        ParagraphStyle(
            'DisclaimerText',
            parent=styles['NormalText'],
            fontSize=8,
            textColor=colors.black,
            borderWidth=1,
            borderColor=colors.grey,
            borderPadding=6,
            borderRadius=3,
            backColor=colors.HexColor("#f2f6fc")
        )
    )
    story.append(disclaimer_text)
    
    # Final footer with better spacing
    story.append(Spacer(1, 0.2*inch))
    
    footer_text = f"{PROJECT_NAME} • Treatment Plan ID: {hash(str(treatment_data)[:20]) % 10000:04d} • Page: "
    story.append(Paragraph(footer_text, styles['Footer']))
    story.append(Paragraph("Always consult with a qualified healthcare professional before implementing this plan.", styles['Footer']))