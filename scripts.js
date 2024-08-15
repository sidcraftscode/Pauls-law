let chart = null; // Initialize chart variable

        function paulsLaw(t1, d1, d2) {
            return t1 + 5 * Math.log2(d2 / d1);
        }

        function split(t, d) {
            return t / (d / 500);
        }

        function time(split, d) {
            return split * (d / 500);
        }

        function padZero(num) {
            return String(num).padStart(2, '0');
        }

        function parseTimeInput(hours, minutes, seconds) {
            const h = parseFloat(hours) || 0;
            const m = parseFloat(minutes) || 0;
            const s = parseFloat(seconds) || 0;
            return (h * 3600) + (m * 60) + s; // Convert to total seconds
        }

        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.round(seconds % 60);
            return `${padZero(mins)}:${padZero(secs)}`;
        }

        function formatTotalTime(seconds) {
            const hrs = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = Math.round(seconds % 60);
            return `${padZero(hrs)}:${padZero(mins)}:${padZero(secs)}`;
        }

        function calculateTimes() {
            const hours = document.getElementById('hours').value;
            const minutes = document.getElementById('minutes').value;
            const seconds = document.getElementById('seconds').value;
            const d1 = document.getElementById('d1').value || 0;

            const d1Value = parseFloat(d1);
            if (isNaN(d1Value)) {
                return;
            }

            const t1 = parseTimeInput(hours, minutes, seconds);

            const distances = [250, 500, 1000, 2000, 5000, 6000, 10000, 21097, 42195];
            const splits = distances.map(d2 => {
                const splitTime = paulsLaw(split(t1, d1Value), d1Value, d2);
                const totalTime = time(splitTime, d2);
                return {
                    x: d2,
                    y: splitTime,
                    total: totalTime
                };
            });

            // Draw the chart and update the table
            drawChart(splits);
            updateTable(splits);
        }

        function drawChart(splits) {
            const ctx = document.getElementById('chart').getContext('2d');

            // Destroy previous chart instance if it exists
            if (chart) {
                chart.destroy();
            }

            // Make the chart container visible
            document.getElementById('chart-container').style.display = 'block';

            // Create a new chart instance
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Split Time per 500m',
                        data: splits,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                        tension: 0.1,
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Distance (meters)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return `${value}m`;
                                }
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Split Time per 500m'
                            },
                            ticks: {
                                callback: function(value) {
                                    return formatTime(value);
                                }
                            },
                            min: 0,
                            max: 180
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const splitTime = context.raw.y;
                                    return `Split Time: ${formatTime(splitTime)}`;
                                }
                            }
                        }
                    }
                }
            });
        }

        function updateTable(splits) {
            const tableBody = document.getElementById('table-body');

            // Clear any previous results
            tableBody.innerHTML = '';

            // Populate the table with the new results
            splits.forEach(split => {
                const row = document.createElement('tr');
                const distanceCell = document.createElement('td');
                const splitTimeCell = document.createElement('td');
                const totalTimeCell = document.createElement('td');

                distanceCell.textContent = `${split.x}m`;
                splitTimeCell.textContent = formatTime(split.y);
                totalTimeCell.textContent = formatTotalTime(split.total);

                row.appendChild(distanceCell);
                row.appendChild(splitTimeCell);
                row.appendChild(totalTimeCell);
                tableBody.appendChild(row);
            });

            // Make the results table visible
            document.getElementById('results-table').style.display = 'table';
        }

        function formatTimeInput(event) {
            const input = event.target;
            const value = input.value.replace(/\D/g, ''); // Remove non-digit characters

            if (input.id === 'hours' && value.length >= 2) {
                input.value = value.slice(0, 2);
                document.getElementById('minutes').focus();
            } else if (input.id === 'minutes' && value.length >= 2) {
                input.value = value.slice(0, 2);
                document.getElementById('seconds').focus();
            } else if (input.id === 'seconds' && value.length >= 2) {
                input.value = value.slice(0, 2);
                document.getElementById('seconds').blur(); // Optionally, remove focus after entering seconds
            } else {
                input.value = value;
            }
        }

        function selectAllText(event) {
            const input = event.target;
            input.select(); // Select all text in the input field
        }

        function filterNumericInput(event) {
            const input = event.target;
            input.value = input.value.replace(/[^0-9]/g, ''); // Allow only numeric characters
        }

        window.addEventListener('DOMContentLoaded', () => {
            document.getElementById('hours').addEventListener('focus', selectAllText);
            document.getElementById('minutes').addEventListener('focus', selectAllText);
            document.getElementById('seconds').addEventListener('focus', selectAllText);

            document.getElementById('d1').addEventListener('input', filterNumericInput);
        });
