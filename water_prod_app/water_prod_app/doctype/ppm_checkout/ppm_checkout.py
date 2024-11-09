# Copyright (c) 2024, Jide Olayinka and Other ArdentPros Dev and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class PPMCheckout(Document):
	#pass
    def on_update(self):
        #change to on_submit
        # auto make stock entry
        print(f'\n ****************************')
        self.make_material_transfer()
        
    def make_material_transfer(self):        
        manufacture_items = []
        #self.doc.readings
        for r in self.readings:
            manufacture_items.append({
                "doctype": "Stock Entry Detail",
                "conversion_factor": 1,
                "item_code": r.item,
                "qty": r.qty,
                "s_warehouse": self.issue_from,
                "t_warehouse": self.to_warehouse
			})
