frappe.listview_settings['Prod Cycle Closing'] = {
    onload: function(listview) {
        // Add an “Quick Add” button to the list page
        listview.page.add_inner_button(__('Quick Add'), () => {
            // Define the dialog
            const dialog = new frappe.ui.Dialog({
                title: __('New Prod Closing Cycle'),
                fields: [
                    {
                        label: __('Cycle End Date'),
                        fieldname: 'cycle_end_date',
                        fieldtype: 'Datetime',
                        reqd: 1,
                        default: 'Today'
                    },
                    {
                        label: __('Prod Cycle Open'),
                        fieldname: 'prod_cycle_open',
                        fieldtype: 'Link',
                        options: 'Prod Cycle Open',
                        reqd: 1,
                        get_query: () => poc_query(),
                    },
                    {
                        label: __('Closing Figure Reconciliation'),
                        fieldname: 'closing_figure_reconciliation',
                        fieldtype: 'Table',
                        reqd: 1,
                        fields: [
                            {
                                label: __('Item Code'),
                                fieldname: 'item_code',
                                fieldtype: 'Link',
                                in_list_view: 1,
                                options: 'Item',
                                reqd: 1
                            },
                            {
                                label: __('Quantity'),
                                fieldname: 'qty',
                                fieldtype: 'Float',
                                in_list_view: 1,
                                reqd: 1
                            }
                        ]
                    }
                ]
            });

            // Hook up the Save button
            dialog.set_primary_action(__('Save'), () => {
                const values = dialog.get_values();
                if (!values) return;

                // Call the server‐side method
                frappe.call({
                    method: 'water_prod_app.water_prod_app.doctype.prod_cycle_closing.prod_cycle_closing.quick_create',
                    args: {
                        end: values.cycle_end_date,
                        cycle: values.prod_cycle_open,
                        items:  values.closing_figure_reconciliation
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
                    filters: { status: "Progress"},
                }
            }
        });
    }
};
