# Copyright (c) 2025, Jide Olayinka and Other ArdentPros Dev and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ProdCycleOpen(Document):
	#pass
    def on_submit(self):
        """kkkd"""
        self.db_set("status", "Progress")
