frappe.listview_settings['Prod Loadout Count'] = {
    onload: function(listview) {
        // Add an “Quick Add” button to the list page
        listview.page.add_inner_button(__('Quick Count'), () => {
            // Define the dialog
            const dialog = new frappe.ui.Dialog({
                title: __('New Loadout Count'),
                fields: [
                    {
                        label: __('Prod Cycle Open'),
                        fieldname: 'prod_cycle_open',
                        fieldtype: 'Link',
                        options: 'Prod Cycle Open',
                        reqd: 1,
                        get_query: () => poc_query(),
                    },
                    {
                        label: __('Load Quantity'),
                        fieldname: 'out_qty',
                        fieldtype: 'Float',
                        reqd: 1
                    },
                    {
                        label: __('Item'),
                        fieldname: 'item',
                        fieldtype: 'Link',
                        options: 'Item',
                        reqd: 1,
                    },
                    {
                        label: __('Recorder'),
                        fieldname: 'recorder',
                        fieldtype: 'Link',
                        options: 'User',
                        default: frappe.session.user,
                        hidden: 1
                    }
                ]
            });

            // Hook up the Save button
            dialog.set_primary_action(__('Save'), () => {
                const values = dialog.get_values();
                if (!values) return;

                // Call the server‐side method
                frappe.call({
                    method: 'water_prod_app.water_prod_app.doctype.prod_loadout_count.prod_loadout_count.quick_loadout',
                    args: {
                        prd_cyc: values.prod_cycle_open,
                        load_item:  values.item,
                        qty: values.out_qty,
                        recorder: values.recorder
                    },
                    callback: (r) => {
                        if (r.message) {
                            frappe.msgprint(__('Created: {0}', [r.message]));
                            dialog.hide();
                            listview.refresh();
                        }
                    }
                });
            });

            dialog.show();
            const poc_query = () => {
                return {
                    filters: { status: "In Progress"},
                }
            }
        });
    }
};
