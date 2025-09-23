# Copyright (c) 2025, Jide Olayinka and Other ArdentPros Dev and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe import _
from frappe.utils import flt, get_datetime


class ProdLoadoutCount(Document):
	pass

@frappe.whitelist()
def quick_loadout(prd_cyc, load_item, qty, recorder):
	""" run count"""

	try:
		doc = frappe.get_doc({
			#Prod Loadout Count
			"doctype": "Prod Loadout Count",
            "prod_cycle": prd_cyc,
            "item": load_item,
            "loading_quantity": flt(qty),
			"counter": recorder
		}).insert(ignore_permissions=True)

		return doc.name
	except Exception:
		frappe.throw(_('Quick Count Failed'), _('Could not create new load out record'))