
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


