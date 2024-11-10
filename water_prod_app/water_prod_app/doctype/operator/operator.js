// Copyright (c) 2024, Jide Olayinka and Other ArdentPros Dev and contributors
// For license information, please see license.txt

frappe.ui.form.on("Operator", {
	refresh(frm) {
        frm.set_query("tag_link_to", () => {
            return {
                filters: [
                    ["name", "in", ["User", "Employee"]]
                ]
            }
        })

	},
    tag_link_to: function () {
        if(frm.doc.tag_link_to === "User"){
            frm.doc.user_code = ""
            frm.doc.user_name = ""
            cur_frm.refresh_fields(["user_code","user_name"]);
        } else if (frm.doc.tag_link_to === "Employee"){
            frm.doc.employee_code = ""
            frm.doc.employee_name = ""
            cur_frm.refresh_fields(["employee_code", "employee_name"]);
        }
    },
});
