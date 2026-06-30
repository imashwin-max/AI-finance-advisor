import io
import csv
from datetime import datetime
from typing import List
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from models.transaction import Transaction
from services.analytics_service import compute_summary, compute_category_breakdown, compute_top_merchants
from services.health_score_service import compute_health_score


def generate_csv_export(transactions: List[Transaction]) -> bytes:
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["Date", "Description", "Merchant", "Category", "Debit", "Credit", "Balance"])
    for t in sorted(transactions, key=lambda x: x.date):
        writer.writerow([t.date.isoformat(), t.description, t.merchant or "", t.category, t.debit, t.credit, t.balance or ""])
    return buffer.getvalue().encode("utf-8")


def generate_pdf_export(transactions: List[Transaction], user_name: str = "User") -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=20 * mm, bottomMargin=20 * mm)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("TitleStyle", parent=styles["Title"], textColor=colors.HexColor("#7c5cff"))
    heading_style = ParagraphStyle("HeadingStyle", parent=styles["Heading2"], spaceBefore=14, spaceAfter=8)

    elements = []
    elements.append(Paragraph("AI Finance Advisor - Financial Report", title_style))
    elements.append(Paragraph(f"Generated for {user_name} on {datetime.now().strftime('%d %b %Y')}", styles["Normal"]))
    elements.append(Spacer(1, 12))

    summary = compute_summary(transactions)
    summary_data = [
        ["Total Income", f"Rs {summary['total_income']:.0f}"],
        ["Total Expenses", f"Rs {summary['total_expenses']:.0f}"],
        ["Savings", f"Rs {summary['savings']:.0f}"],
        ["Savings Rate", f"{summary['savings_rate_pct']:.1f}%"],
        ["Largest Category", summary["largest_category"] or "-"],
        ["Top Merchant", summary["top_merchant"] or "-"],
        ["Total Transactions", str(summary["transaction_count"])],
    ]
    elements.append(Paragraph("Summary", heading_style))
    summary_table = Table(summary_data, colWidths=[200, 200])
    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#13161d")),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#22262f")),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.whitesmoke, colors.white]),
    ]))
    elements.append(summary_table)

    elements.append(Paragraph("Spending by Category", heading_style))
    category_rows = [["Category", "Total", "% of Expenses"]]
    for c in compute_category_breakdown(transactions):
        category_rows.append([c["category"], f"Rs {c['total']:.0f}", f"{c['pct_of_expenses']:.1f}%"])
    if len(category_rows) > 1:
        cat_table = Table(category_rows, colWidths=[180, 130, 130])
        cat_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#7c5cff")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#22262f")),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
        ]))
        elements.append(cat_table)
    else:
        elements.append(Paragraph("No category data available.", styles["Normal"]))

    elements.append(Paragraph("Top Merchants", heading_style))
    merchant_rows = [["Merchant", "Total Spent", "Transactions"]]
    for m in compute_top_merchants(transactions, limit=8):
        merchant_rows.append([m["merchant"], f"Rs {m['total']:.0f}", str(m["count"])])
    if len(merchant_rows) > 1:
        merch_table = Table(merchant_rows, colWidths=[180, 130, 130])
        merch_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#22d3ee")),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#22262f")),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
        ]))
        elements.append(merch_table)
    else:
        elements.append(Paragraph("No merchant data available.", styles["Normal"]))

    health = compute_health_score(transactions)
    elements.append(Paragraph("Financial Health Score", heading_style))
    elements.append(Paragraph(f"Score: {health['score']} / 100 - {health['level']}", styles["Normal"]))
    for s in health["suggestions"]:
        elements.append(Paragraph(f"- {s}", styles["Normal"]))

    doc.build(elements)
    return buffer.getvalue()
