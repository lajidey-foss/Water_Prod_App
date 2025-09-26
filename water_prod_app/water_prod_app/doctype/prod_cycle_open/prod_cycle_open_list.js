//

frappe.listview_settings["Prod Cycle Open"] = {
	get_indicator: function (doc) {
		var status_color = {
			Draft: "red",
			Progress: "orange",
			Completed: "green",
			Cancelled: "red",
		};
		return [__(doc.status), status_color[doc.status], "status,=," + doc.status];
	},
};