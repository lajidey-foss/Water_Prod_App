// Copyright (c) 2025, Jide Olayinka and Other ArdentPros Dev and contributors
// For license information, please see license.txt

frappe.ui.form.on("Prod Loadout Count", {
	onload: function (frm) {
        frm.set_query("prod_cycle", function (doc) {
            return { filters: { status: "In Progress"} };
		});
    }
});
