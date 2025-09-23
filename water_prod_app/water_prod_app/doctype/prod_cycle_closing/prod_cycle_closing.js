// Copyright (c) 2025, Jide Olayinka and Other ArdentPros Dev and contributors
// For license information, please see license.txt

frappe.ui.form.on("Prod Cycle Closing", {
    onload: function(frm) {
        frm.set_query("prod_cycle_open", function (doc) {
            return { filters: { status: "In Progress"} };
			//return { filters: { status: "Draft", docstatus: 1 } };
		});
    },
    setup: function(frm){
        frm.check_count_for_duplicates = function(frm, row){
            frm.doc.prod_count_truckings.forEach(lc => {
                if(!(row.prod_loadout == ''|| lc.idx== row.idx)){
                    if(row.prod_loadout == lc.prod_loadout){
                        row.prod_loadout = '';
                        row.count_quantity = '';
                        //remove that row and refresh
                        frm.refresh_field('prod_count_truckings');
                    }
                }
            });
        }
        frm.get_total_hours = function(frm){
            let total_hour = 0;
            frm.doc.prod_count_truckings.forEach(lc =>{
                total_hour += flt(lc.count_quantity);
            })
            frm.set_value('total_loadout_count', total_hour);
        }
    }
});

frappe.ui.form.on('Prod Loadout Reference', {
    prod_loadout: function(frm, cdt, cdn){
        let row = locals[cdt][cdn];
        frm.check_count_for_duplicates(frm, row);
        frm.get_total_hours(frm);        
        frm.refresh_field('prod_loadout');
    },
    prod_count_truckings_remove: function(frm, cdt, cdn){
        frm.get_total_hours(frm)
    }
});