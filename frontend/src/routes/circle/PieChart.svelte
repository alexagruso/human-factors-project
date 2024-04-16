<script>
    import * as d3 from "d3";

    // Receive plot data as prop.
    export let data;

    let foodAmount = 0.0;
    let persCareAmount = 0.0;
    let merchAmount = 0.0;
    let otherAmount = 0.0;
    let autoAmount = 0.0;
    let clothesAmount = 0.0;

    //console.log(data.items)

    for (let i in data.items) {
        switch (data.items[i]["category"]) {
            case "Food":
                foodAmount += data.items[i]["price"] * data.items[i]["quantity"];
                break;
            case "Merchandise":
                merchAmount += data.items[i]["price"] * data.items[i]["quantity"];
                break;
            case "Personal Care":
                persCareAmount += data.items[i]["price"] * data.items[i]["quantity"];
                break;
            case "Other":
                otherAmount += data.items[i]["price"] * data.items[i]["quantity"];
                break;
            case "Clothes":
                clothesAmount += data.items[i]["price"] * data.items[i]["quantity"];
                break;
            case "Automotive":
                autoAmount += data.items[i]["price"] * data.items[i]["quantity"];
                break;
        }
    }

    let total = foodAmount + merchAmount + persCareAmount + otherAmount + clothesAmount + autoAmount;

    data = [];
    if (foodAmount > 0) {
        data.push({
            name: "Food",
            value: foodAmount.toFixed(2),
        });
    }
    if (autoAmount > 0) {
        data.push({
            name: "Automotive",
            value: autoAmount.toFixed(2),
        });
    }
    if (merchAmount > 0) {
        data.push({
            name: "Merchandise",
            value: merchAmount.toFixed(2),
        });
    }
    if (persCareAmount > 0) {
        data.push({
            name: "Personal Care",
            value: persCareAmount.toFixed(2),
        });
    }
    if (clothesAmount > 0) {
        data.push({
            name: "Clothes",
            value: clothesAmount.toFixed(2),
        });
    }
    if (otherAmount > 0) {
        data.push({
            name: "Other",
            value: otherAmount.toFixed(2),
        });
    }

    let colorScale = d3
        .scaleOrdinal() //by default the chart is filled with light blue as it has no data
        .domain(["test"])
        .range(["lightblue"]);
    let empty = false;
    if (Object.keys(data).length === 0) {
        data.push({
            name: "",
            value: 100.0,
        });
        empty = true;
    } //if the chart has data then we have different colors
    else {
        colorScale = d3
            .scaleOrdinal()
            .domain(data.map((d) => d.name))
            .range(d3.quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
    }

    // Specify the chart’s dimensions.
    const width = 350;
    const height = 350;

    // Create the pie layout and arc generator.
    const pie = d3
        .pie()
        .sort(null)
        .value((d) => d.value);

    const arcPath = d3
        .arc()
        .innerRadius(100) //this can be changed to decide whether or not its a donut or a pie chart (>0 means it's a donut and 0 means it's a pie)
        .outerRadius(Math.min(width, height) / 2 - 1);

    const labelRadius = arcPath.outerRadius()() * 0.8;

    // A separate arc generator for labels.
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    const arcs = pie(data);
</script>

<svg
    {width}
    {height}
    viewBox="{-width / 2}, {-height / 2}, {width}, {height}"
    style:max-width="100%"
    style:height="auto"
>
    <g class="data">
        <!-- Loop through the data-slices. -->
        {#each arcs as slice}
            <!-- Add each pie-slice. -->
            <path d={arcPath(slice)} fill={colorScale(slice.data.name)} />

            <!-- Add each label. -->
            <text style="font-weight: bold" transform="translate({arcLabel.centroid(slice)})" text-anchor="middle">
                {slice.data.name}
            </text>

            <!-- show the value if there is enough room. -->
            {#if slice.endAngle - slice.startAngle > 0.25 && !empty}
                <text
                    text-anchor="middle"
                    transform="translate({[arcLabel.centroid(slice)[0], arcLabel.centroid(slice)[1] + 10]})"
                >
                    {((slice.data.value / total) * 100).toFixed(2) + "%"}
                </text>
            {/if}
        {/each}
    </g>
</svg>

<!-- <aside> -->
<!--     <p> -->
<!--         <strong>Made with blood, sweat, and tears ;)</strong><br /> -->
<!--         (nah but fr tears) -->
<!--     </p> -->
<!-- </aside> -->

<style>
    svg {
        font-size: 10px;
    }
    aside {
        text-align: center;
        color: white;
    }
</style>
