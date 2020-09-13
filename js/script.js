// Use $ instead of jQuery
(function ($) {

    $(window).on("load",function () {


            var filteredData = 0;

            $(".toggle-arrow").click(function () {
                $(".filter-wrapper").toggleClass("open");
            });

            function urlCheck() {
                if (window.location.href.lastIndexOf("?") >= 0) {
                    const param = window.location.href.slice(
                        window.location.href.lastIndexOf("?") + 1
                    );
                    fetchData(param);

                    var url = window.location.href
                        .slice(window.location.href.lastIndexOf("?") + 1)
                        .split("&");
                    // console.log("check1",url);
                    url.forEach(function (value, index) {
                        // console.log("flag",value.slice(value.indexOf("=")+1))
                        if (value.indexOf("launch_success") >= 0) {
                            $(
                                "input[type=radio][name='launch_success'][value='" +
                                value.slice(value.indexOf("=") + 1) +
                                "']"
                            ).prop("checked", true);
                            $(
                                "input[type=radio][name='launch_success'][value='" +
                                value.slice(value.indexOf("=") + 1) +
                                "']"
                            ).data("waschecked", true);
                        }
                        if (value.indexOf("land_success") >= 0) {
                            $(
                                "input[type=radio][name='land_success'][value='" +
                                value.slice(value.indexOf("=") + 1) +
                                "']"
                            ).prop("checked", true);
                            $(
                                "input[type=radio][name='land_success'][value='" +
                                value.slice(value.indexOf("=") + 1) +
                                "']"
                            ).data("waschecked", true);
                        }
                        if (value.indexOf("launch_year") >= 0) {
                            $(
                                "input[type=radio][name='launch_year'][value='" +
                                value.slice(value.indexOf("=") + 1) +
                                "']"
                            ).prop("checked", true);
                            $(
                                "input[type=radio][name='launch_year'][value='" +
                                value.slice(value.indexOf("=") + 1) +
                                "']"
                            ).data("waschecked", true);
                        }
                    });
                } else {
                    fetchData();
                }
            }

            function createCard(data) {
                var datawrapper = $(".card-wrapper");
                datawrapper.empty();
                data.forEach(function (currentValue, index) {
                    console.log(currentValue);
                    datawrapper.append(`<div class="card">
        <img src="${currentValue.links.mission_patch_small}" alt="${currentValue.mission_name}">
          <div class="content-wrapper">
           <h4>${currentValue.mission_name} #${currentValue.flight_number}</h4>
            <div class="data-row">
              <span>Mission Ids:</span>
              <span>${currentValue.mission_id[0]}</span>
            </div>
            <div class="data-row">
              <span>Launch Year:</span>
              <span>${currentValue.launch_year}</span>
            </div>
             <div class="data-row">
              <span>Successful Launch:</span>
              <span>${currentValue.launch_success}</span>
            </div>
             <div class="data-row">
              <span>Successful Landing:</span>
              <span>${currentValue.rocket.first_stage.cores[0].land_success}</span>
            </div>
          </div>
        </div>`);
                });
            }

// filter form/ajax request

            $(document).on("click", "input[type=radio]", function (event) {
                var previousValue = $(this).data("waschecked");
                // console.log($(this).attr('name'));
                if (previousValue === true) {
                    this.checked = false;
                    $("input[type=radio][name=" + $(this).attr("name") + "]").data(
                        "waschecked",
                        false
                    );
                    $(this).data("waschecked", false);
                } else {
                    this.checked = true;
                    $("input[type=radio][name=" + $(this).attr("name") + "]").data(
                        "waschecked",
                        false
                    );
                    $(this).data("waschecked", true);
                }
                fetchData();
            });

            function fetchData(param = 0) {
                if (param) {
                    $("#loader").show();
                    $(".card-wrapper").hide();
                    $("#no-data").hide();
                    $.ajax({
                        url: "https://api.spaceXdata.com/v3/launches?limit=100&" + param,
                        type: "get"
                    })
                        .done(function (response) {
                            // console.log(response);
                            filteredData = response;
                            createCard(filteredData);
                            if (response.length) {
                                setTimeout(function () {
                                    $("#loader").hide();
                                    $(".card-wrapper").show();
                                }, 400);
                            } else {
                                setTimeout(function () {
                                    $("#loader").hide();
                                    $("#no-data").show();
                                }, 400);
                            }
                        })
                        .fail(function (error) {});
                } else {
                    var data = {};
                    $("form")
                        .serializeArray()
                        .map(function (x) {
                            data[x.name] = x.value;
                        });
                    // console.log(data);
                    $("#loader").show();
                    $(".card-wrapper").hide();
                    $("#no-data").hide();
                    $.ajax({
                        url: "https://api.spaceXdata.com/v3/launches?limit=100&" + $.param(data),
                        type: "get"
                    })
                        .done(function (response) {
                            // console.log(response);
                            filteredData = response;
                            createCard(filteredData);

                            const baseurl = window.location.href.slice(
                                window.location.href.indexOf("?") + 1
                            );
                            // console.log(baseurl);
                            history.pushState(null, null, "?" + $.param(data) + "");

                            if (response.length) {
                                setTimeout(function () {
                                    $("#loader").hide();
                                    $(".card-wrapper").show();
                                }, 400);
                            } else {
                                setTimeout(function () {
                                    $("#loader").hide();
                                    $("#no-data").show();
                                }, 400);
                            }
                        })
                        .fail(function (error) {});
                }
            }


        urlCheck();

    });
})(jQuery);