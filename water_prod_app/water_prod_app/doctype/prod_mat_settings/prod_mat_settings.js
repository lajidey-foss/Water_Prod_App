// Copyright (c) 2024, Jide Olayinka and Other ArdentPros Dev and contributors
// For license information, please see license.txt

frappe.ui.form.on("Prod Mat Settings", {
    setup: function(frm){
        frm.get_total_charges = function(frm){
            let total_charge = 0;
            frm.doc.charges_details.forEach(tc => {
                total_charge += flt(tc.cost_per_item);
            })
            frm.set_value("total_extra_cost",total_charge);
        }
    }
});

frappe.ui.form.on('PMwise Cost Details', {
    cost_per_item: function(frm, cdt, cdn){
        //let row = locals[cdt][cdn];
        frm.get_total_charges(frm);
        frm.refresh_field(cost_per_item);
    },
    charges_details_remove: function(frm, cdt, cdn){
        frm.get_total_charges(frm);
        //frm.refresh(cost_per_item);
    }
});