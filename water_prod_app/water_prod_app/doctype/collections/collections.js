// Copyright (c) 2025, Jide Olayinka and Other ArdentPros Dev and contributors
// For license information, please see license.txt

frappe.ui.form.on("Collections", {
	onload: function (frm) {
        frm.set_query("production_cycle", function (doc) {
            return { filters: { status: "Progress"} };
		});
	},
    setup: (frm) => {
        frm.get_total_fig = function(frm){
            let total_qty = 0; 
            frm.doc.records.forEach(element => {
                total_qty += flt (element.qty);
            });
            frm.set_value("total_qty",total_qty);
        },
        frm.get_weight_fig = function(frm){
            let total_weight = 0.0;
            frm.doc.records.forEach(element => {
                total_weight += flt(element.weight);
            });
            frm.set_value("weight_figure", total_weight);
        }
    }
});


frappe.ui.form.on("Record Detail", {
    qty: function(frm, cdt, cdn){
        frm.get_total_fig(frm);
        frm.refresh_field(qty);
    },
    weight: function(frm, cdt, cdn){
        frm.get_weight_fig(frm);
        frm.refresh_field(weight);
    }
})