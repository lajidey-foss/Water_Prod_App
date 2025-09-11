
from __future__ import unicode_literals
import frappe
from frappe import _


def work_flow (doc, method):
    """ hook labour and energy cost to production  movement """

    #check if app is enabled 
    if not frappe.db.get_single_value('Water Prod Settings', 'enabled'):
        return
    
    #progress
    if (doc.stock_entry_type == "Manufacture"):
        prod_extra_cost(doc)
        

def prod_extra_cost (data):    
    #print(f'\n\n =========================> \n\n')
    # Landed Cost Taxes and Charges
    extra_charge = frappe.db.get_single_value('Prod Mat Settings', 'total_extra_cost')
    #charges_items_row = []
    item_row = data.items
    total_charge = item_row[-1].qty * extra_charge

    # check if charges is greater than zero
    if (total_charge <= 0):
        return
    
    manufac_acc_head = frappe.db.get_single_value('Prod Mat Settings', 'manufac_expense_head')

    charges_items_row = data.additional_costs or []    
    charges_items_row.append({
        "expense_account": manufac_acc_head,
        "description": "Cost of manufacturing for single finish product",
        "amount": total_charge 
    })
    
    data.update({"additional_costs":charges_items_row})
    data.save()

def purchase_count (doc, method):
    """ hook count into purchase """
    # check if count is enabled
    print(f"[=====================================]\n\n\n\n\n return error code: {countx[0]['ipnx']}")
    if not frappe.db.get_single_value('Counting Setting', 'enabled'):
        return
    
    # run app
    if (doc.doctype == "Purchase Invoice"):
        run_count_ledger(doc)
    
def run_count_ledger(data):
    """ intercept purchase """
    get_list = frappe.db.sql(
        f"""
            select item, uom, parentfield, parenttype from `tabCountings Set Details` where parenttype = 'Counting Setting'
        """, as_dict=1,
    )
    pm_count_list = [{'item': pm.get('item'), 'uom': pm.get('uom')}
                     for pm in frappe.db.sql(""" select item, uom, parentfield, parenttype from `tabCountings Set Details` where parenttype = 'Counting Setting' """,
                                             as_dict=True)
                     ]
    # Convert to dict for quick lookup
    pm_lookup = {row['item']: row['uom'] for row in pm_count_list}

    for item in data.items:
        if item.item_code in pm_lookup:
            frappe.get_doc({
                "doctype": "Prod Mat Ledger",
                "doc_doctype": data.doctype,
                "company": data.company,
                "item": item.item_code,       # matched item_code
                "uom": pm_lookup[item.item_code],  # uom from pm_list
                "ledger_type": "IN",
                "doc_name": data.name,
                "warehouse": data.set_warehouse,
                "voucher_date": data.posting_date,
                "voucher_date": data.posting_date,
                "figure": item.custom_count_qty
            }).insert(ignore_permissions=True)

    frappe.db.commit()           
    #

def collection_inx(doc, method):
    """ """
    for record in doc.records:
        frappe.get_doc({
            "doctype": "Prod Mat Ledger",
            "doc_doctype": doc.doctype,
            "ledger_type": "OUT",
            "item":       record.item,
            "uom":        record.uom,
            "doc_name": doc.name,
            "warehouse": doc.issue_from,
            "voucher_date": doc.voucher_date,
            "figure": record.qty * -1
        }).insert(ignore_permissions=True)

    frappe.db.commit()
    