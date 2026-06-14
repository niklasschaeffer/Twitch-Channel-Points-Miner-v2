var options = {
    series: [],
    chart: {
        type: 'area',
        stacked: false,
        height: '100%',
        zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
        },
        foreColor: '#efeff1',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        toolbar: {
            show: true,
            tools: {
                download: false,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true
            }
        }
    },
    theme: {
        mode: 'dark'
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    markers: {
        size: 0,
    },
    title: {
        text: 'Channel points (UTC)',
        align: 'left',
        style: {
            fontSize: '16px',
            fontWeight: 600,
            color: '#efeff1'
        }
    },
    colors: ["#a970ff"],
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [0, 90, 100]
        },
    },
    grid: {
        borderColor: '#2c2c35',
        strokeDashArray: 4
    },
    yaxis: {
        title: {
            text: 'Channel points',
            style: { color: '#adadb8' }
        },
    },
    xaxis: {
        type: 'datetime',
        labels: {
            datetimeUTC: false,
            style: { colors: '#adadb8' }
        },
        axisBorder: { show: false },
        axisTicks: { color: '#2c2c35' }
    },
    tooltip: {
        theme: 'dark',
        shared: false,
        x: {
            show: true,
            format: 'HH:mm:ss dd MMM',
        },
        custom: ({
            series,
            seriesIndex,
            dataPointIndex,
            w
        }) => {
            return (`<div class="apexcharts-active">
                <div class="apexcharts-tooltip-title">${w.globals.seriesNames[seriesIndex]}</div>
                <div class="apexcharts-tooltip-series-group apexcharts-active" style="order: 1; display: flex; padding-bottom: 0px !important;">
                    <div class="apexcharts-tooltip-text">
                        <div class="apexcharts-tooltip-y-group">
                            <span class="apexcharts-tooltip-text-label"><b>Points</b>: ${series[seriesIndex][dataPointIndex]}</span><br>
                            <span class="apexcharts-tooltip-text-label"><b>Reason</b>: ${w.globals.seriesZ[seriesIndex][dataPointIndex] ? w.globals.seriesZ[seriesIndex][dataPointIndex] : ''}</span>
                        </div>
                    </div>
                </div>
                </div>`)
        }
    },
    noData: {
        text: 'Loading...',
        align: 'center',
        verticalAlign: 'middle',
        style: { color: '#adadb8' }
    }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
var currentStreamer = null;
var annotations = [];

var streamersList = [];
var sortBy = "Name ascending";
var sortField = 'name';

var startDate = new Date();
startDate.setDate(startDate.getDate() - daysAgo);
var endDate = new Date();

$(document).ready(function () {
    var isLogCheckboxChecked = $('#log').prop('checked');
    var autoUpdateLog = true;
    var lastReceivedLogIndex = 0;

    $('#auto-update-log').click(() => {
        autoUpdateLog = !autoUpdateLog;
        $('#auto-update-log').text(autoUpdateLog ? '⏸️' : '▶️');

        if (autoUpdateLog) {
            getLog();
        }
    });

    function getLog() {
        if (isLogCheckboxChecked) {
            $.get(`/log?lastIndex=${lastReceivedLogIndex}`, function (data) {
                $("#log-content").append(data);
                $("#log-content").scrollTop($("#log-content")[0].scrollHeight);
                lastReceivedLogIndex += data.length;
            });
        }
    }

    setInterval(getLog, refresh);

    var headerVisibility = localStorage.getItem('headerVisibility');
    if (headerVisibility === 'hidden') {
        $('#toggle-header').prop('checked', false);
        $('#header').hide();
    } else {
        $('#toggle-header').prop('checked', true);
        $('#header').show();
    }

    $('#toggle-header').change(function () {
        if (this.checked) {
            $('#header').show();
            localStorage.setItem('headerVisibility', 'visible');
        } else {
            $('#header').hide();
            localStorage.setItem('headerVisibility', 'hidden');
        }
    });

    chart.render();

    if (!localStorage.getItem("annotations")) localStorage.setItem("annotations", true);
    if (!localStorage.getItem("dark-mode")) localStorage.setItem("dark-mode", true);
    if (!localStorage.getItem("sort-by")) localStorage.setItem("sort-by", "Name ascending");

    $('#annotations').prop("checked", localStorage.getItem("annotations") === "true");
    $('#dark-mode').prop("checked", localStorage.getItem("dark-mode") === "true");

    $('#annotations').click(() => {
        var isChecked = $('#annotations').prop("checked");
        localStorage.setItem("annotations", isChecked);
        updateAnnotations();
    });

    $('#dark-mode').click(() => {
        var isChecked = $('#dark-mode').prop("checked");
        localStorage.setItem("dark-mode", isChecked);
        toggleDarkMode();
    });

    $('#startDate').val(formatDate(startDate));
    $('#endDate').val(formatDate(endDate));

    sortBy = localStorage.getItem("sort-by");
    if (sortBy.includes("Points")) sortField = 'points';
    else if (sortBy.includes("Last activity")) sortField = 'last_activity';
    else sortField = 'name';
    $('#sorting-by').text(sortBy);
    getStreamers();

    updateAnnotations();
    toggleDarkMode();

    var logCheckboxState = localStorage.getItem('logCheckboxState');
    $('#log').prop('checked', logCheckboxState === 'true');
    if (logCheckboxState === 'true') {
        isLogCheckboxChecked = true;
        $('#auto-update-log').show();
        $('#log-box').show();
        getLog();
    }

    $('#log').change(function () {
        isLogCheckboxChecked = $(this).prop('checked');
        localStorage.setItem('logCheckboxState', isLogCheckboxChecked);

        if (isLogCheckboxChecked) {
            $('#log-box').show();
            $('#auto-update-log').show();
            getLog();
            $('html, body').scrollTop($(document).height());
        } else {
            $('#log-box').hide();
            $('#auto-update-log').hide();
        }
    });
});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function formatPoints(value) {
    if (value === undefined || value === null) return '';
    return value.toLocaleString();
}

function changeStreamer(streamer, index) {
    $("#streamers-list .streamer-item").removeClass("is-active");
    $(`#streamer-${CSS.escape(streamer)}`).addClass('is-active');
    currentStreamer = streamer;

    options.title.text = streamer.replace(".json", "") + "'s channel points (UTC)";
    chart.updateOptions(options);

    localStorage.setItem("selectedStreamer", currentStreamer);

    getStreamerData(streamer);
}

function getStreamerData(streamer) {
    if (currentStreamer == streamer) {
        $.getJSON(`./json/${streamer}`, {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
        }, function (response) {
            chart.updateSeries([{
                name: streamer.replace(".json", ""),
                data: response["series"]
            }], true)
            clearAnnotations();
            annotations = response["annotations"];
            updateAnnotations();
            setTimeout(function () {
                getStreamerData(streamer);
            }, 300000);
        });
    }
}

function getAllStreamersData() {
    $.getJSON(`./json_all`, function (response) {
        for (var i in response) {
            chart.appendSeries({
                name: response[i]["name"].replace(".json", ""),
                data: response[i]["data"]["series"]
            }, true)
        }
    });
}

function getStreamers() {
    $.getJSON('streamers', function (response) {
        streamersList = response;
        sortStreamers();

        var selectedStreamer = localStorage.getItem("selectedStreamer");
        if (selectedStreamer) {
            currentStreamer = selectedStreamer;
        } else {
            currentStreamer = streamersList.length > 0 ? streamersList[0].name : null;
        }

        renderStreamers();
    });
}

function renderStreamers() {
    $("#streamers-list").empty();
    var promised = new Promise((resolve, reject) => {
        streamersList.forEach((streamer, index, array) => {
            var displayName = streamer.name.replace(".json", "");
            var meta = '';
            if (sortField == 'points') meta = `<span class="streamer-meta">${formatPoints(streamer['points'])}</span>`;
            else if (sortField == 'last_activity') meta = `<span class="streamer-meta">${formatDate(streamer['last_activity'])}</span>`;

            var isActive = currentStreamer === streamer.name;
            if (!isActive && localStorage.getItem("selectedStreamer") === null && index === 0) {
                isActive = true;
                currentStreamer = streamer.name;
            }
            var activeClass = isActive ? 'is-active' : '';
            var safeName = streamer.name.replace(/'/g, "\\'");
            var listItem = `<div id="streamer-${streamer.name}" class="streamer-item ${activeClass}" onClick="changeStreamer('${safeName}', ${index + 1}); return false;">
                <span>${displayName}</span>
                ${meta}
            </div>`;
            $("#streamers-list").append(listItem);
            if (isActive) {
                document.getElementById(`streamer-${streamer.name}`).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
            if (index === array.length - 1) resolve();
        });
    });
    promised.then(() => {
        changeStreamer(currentStreamer, streamersList.findIndex(streamer => streamer.name === currentStreamer) + 1);
    });
}

function sortStreamers() {
    streamersList = streamersList.sort((a, b) => {
        return (a[sortField] > b[sortField] ? 1 : -1) * (sortBy.includes("ascending") ? 1 : -1);
    });
}

function changeSortBy(option) {
    sortBy = option.innerText.trim();
    if (sortBy.includes("Points")) sortField = 'points'
    else if (sortBy.includes("Last activity")) sortField = 'last_activity'
    else sortField = 'name';
    sortStreamers();
    renderStreamers();
    $('#sorting-by').text(sortBy);
    localStorage.setItem("sort-by", sortBy);
}

function updateAnnotations() {
    if ($('#annotations').prop("checked") === true) {
        clearAnnotations()
        if (annotations && annotations.length > 0)
            annotations.forEach((annotation, index) => {
                annotations[index]['id'] = `id-${index}`
                chart.addXaxisAnnotation(annotation, true)
            })
    } else clearAnnotations()
}

function clearAnnotations() {
    if (annotations && annotations.length > 0)
        annotations.forEach((annotation, index) => {
            chart.removeAnnotation(annotation['id'])
        })
    chart.clearAnnotations();
}

$('#annotations').click(() => {
    updateAnnotations();
});
$('#dark-mode').click(() => {
    toggleDarkMode();
});

$('.dropdown').click(() => {
    $('.dropdown').toggleClass('is-active');
});

$('#startDate').change(() => {
    startDate = new Date($('#startDate').val());
    getStreamerData(currentStreamer);
});
$('#endDate').change(() => {
    endDate = new Date($('#endDate').val());
    getStreamerData(currentStreamer);
});
