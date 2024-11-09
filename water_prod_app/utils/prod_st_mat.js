frappe.ui.form.on('Stock Entry', {
    
    // refresh(frm){
        
    // },
    stock_entry_type(frm){
        if(frm.doc.stock_entry_type === "Manufacture" || frm.doc.stock_entry_type === "Material Transfer for Manufacture" ){
            frm.set_df_property("custom_ppm_operator", "reqd", 1);
            frm.set_df_property("custom_ppm_machine", "reqd", 1);
            // console.log(frm.doc.stock_entry_type);
        }
        else
        {
            frm.set_df_property("custom_ppm_operator", "reqd", 0);
            frm.set_df_property("custom_ppm_machine", "reqd", 0);
        }
    },
});