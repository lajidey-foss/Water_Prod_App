# Copyright (c) 2025, Jide Olayinka and Other ArdentPros Dev and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document


class ProdCycleClosing(Document):
    def on_submit(self):
        update_opening_cycle(self)


    @frappe.whitelist()
    def get_collection_projection_details(self):
        collection = [{'name': cx.get('name'), 'type': cx.get('type'), 'item': cx.get('item'),
                       'qty': cx.get('qty'), 'uom': cx.get('uom'), 'weight': cx.get('weight'), 'cone': cx.get('cone_weight') }
            for cx in frappe.db.sql(""" 
                                    SELECT c.name, c.type, c.production_cycle, r.item, r.qty, r.uom, r.weight, r.cone_weight 
                                    FROM `tabCollections` c JOIN `tabRecord Detail` r 
                                    ON c.name = r.parent
                                    WHERE c.production_cycle = %s and c.docstatus = 1 """,
                                     (self.prod_cycle_open), as_dict=True, )
        ]

        return frappe.render_template(
            "water_prod_app/water_prod_app/doctype/prod_cycle_closing/closing_summary.html",
            {"data": collection},
        )


def update_opening_cycle(self):
    opening_cycle = frappe.get_doc("Prod Cycle Open", self.prod_cycle_open)
    opening_cycle.prod_cycle_closing = self.name
    opening_cycle.cycle_end_date = self.cycle_end_date
    opening_cycle.status = "Completed"
    opening_cycle.save()

@frappe.whitelist()
def quick_create(end, cycle, items):
    import json
    
    if isinstance(items, str):
         items = json.loads(items)

    loadouts = []
    total_loadout = frappe.db.sql(
         f""" SELECT SUM(`loading_quantity`) FROM `tabProd Loadout Count` WHERE `prod_cycle` = '{cycle}'
        """
    )[0][0] or 0
    if total_loadout > 0:
        loadouts = [{
            'prod_loadout': rx.get('name')
        } for rx in frappe.db.get_values("Prod Loadout Count",{"prod_cycle": ("=", cycle)},["name"], as_dict=True )]
    # get opening count from open cycle
    open_count = frappe.db.sql(f"""
                               SELECT quantity FROM `tabProd Cycle Open Detail` WHERE `parent` = '{cycle}' """
                               )[0][0] or 0
    closing_figures = [{
         'finished_product': row.get('item_code'),
         'close_qty': row.get('qty'),
         'open_qty': open_count
	} for row in items]

    total_expected_produce = open_count + total_loadout + closing_figures[0]['close_qty']
    # begin creation
    try:
        doc = frappe.get_doc({
            'doctype': 'Prod Cycle Closing',
            'cycle_end_date': end,
            'prod_cycle_open': cycle,
            'closing_figure_reconciliation': closing_figures,
            'prod_count_truckings': loadouts,
            'total_loadout_count' : total_loadout,
            'total_quantity': total_expected_produce,
            'cycle_prod_quantity': total_loadout + closing_figures[0]['close_qty']
        })
        
        doc.insert()
        return doc.name
    except Exception:
        frappe.throw(_('Quick Add Failed'), _('Could not create document'))


