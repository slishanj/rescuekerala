$( document ).ready(function() {

    // function to hide and show relevant fields based on the is_inside_kerala checkbox selection
    var toggle_form_fields = function() {
        var is_inside_kerala = $("#id_is_inside_kerala").is(':checked');
        if (is_inside_kerala) {
            $("#id_city").parents('div.form-group').hide();

            $("#id_district").parents('div.form-group').show();
            $("#id_lsg_type").parents('div.form-group').show();
            $("#id_lsg_name").parents('div.form-group').show();
            $("#id_ward_name").parents('div.form-group').show();
        } else {
            $("#id_city").parents('div.form-group').show();

            $("#id_district").parents('div.form-group').hide();
            $("#id_lsg_type").parents('div.form-group').hide();
            $("#id_lsg_name").parents('div.form-group').hide();
            $("#id_ward_name").parents('div.form-group').hide();
        }
    }

    $("#id_is_inside_kerala").change(function() {
        toggle_form_fields();
    });

    if ($('#id_is_inside_kerala').length > 0) toggle_form_fields(); // only do this on collection_centers page where there is this boolean

    var kerala_district_mapping = {
        "ksr": "KASARAGOD",
        "knr": "KANNUR",
        "wnd": "WAYANAD",
        "koz": "KOZHIKODE",
        "mpm": "MALAPPURAM",
        "pkd": "PALAKKAD",
        "tcr": "THRISSUR",
        "ekm": "ERNAKULAM",
        "idk": "IDUKKI",
        "ktm": "KOTTAYAM",
        "alp": "ALAPPUZHA",
        "ptm": "PATHANAMTHITTA",
        "kol": "KOLLAM",
        "tvm": "THIRUVANANTHAPURAM",
    };

    var get_district_local_bodies = function(selected_district) {
        var district_name = kerala_district_mapping[selected_district];
        return kerala_local_bodies[district_name];
    };

    var kerala_local_bodies = {};
    $.ajax({
        url: '/api/1/kerala_local_bodies/',
        data: {},
        dataType: 'json',
        success: function (data) {
            kerala_local_bodies = data;
        }
    });

    var populate_ward_names = function() {
        var selected_district = $("#id_district").find(":selected").val();
        var selected_lsg = $("#id_lsg_name").find(":selected").val();
        if (selected_lsg) {
            var district_local_bodies = get_district_local_bodies(selected_district);

            $("#id_ward_name option").each(function() {
                $(this).remove();
            });

            $.each(district_local_bodies[selected_lsg]['wards'], function(key, value) {
                $('#id_ward_name')
                     .append($("<option></option>")
                                .attr("value", key)
                                .text(value));
            });
        }

    };

    var populate_lsg_names = function() {
        var selected_district = $("#id_district").find(":selected").val();
        if (selected_district) {
            var district_local_bodies = get_district_local_bodies(selected_district);
            $("#id_lsg_name option").each(function() {
                $(this).remove();
            });
            $.each(district_local_bodies, function(key, value) {
                $('#id_lsg_name')
                     .append($("<option></option>")
                                .attr("value", key)
                                .text(value['name']));
            });

            populate_ward_names();
        };

    };

    $("#id_district").change(function() {
        populate_lsg_names();
    });

    $("#id_lsg_name").change(function() {
        populate_ward_names();
    });

});