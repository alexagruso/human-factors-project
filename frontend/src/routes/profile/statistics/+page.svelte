<script lang="ts">
    import PieChart from "../../circle/PieChart.svelte";
    import * as Plot from '@observablehq/plot'
    import type { PageData } from "./$types";
    import * as d3 from "d3";
	import { onMount } from 'svelte';
    export let data: PageData;

    let lineData = [];

    
    let date: Date = new Date()
    let firstDayOf3MonthsAgo : Date = new Date(date.getFullYear(), date.getMonth()-2, 1);
    let firstDayOf2MonthsAgo : Date = new Date(date.getFullYear(), date.getMonth()-1, 1);


    let firstMonth = firstDayOf3MonthsAgo.toISOString().split('T')[0];
    let secondMonth = firstDayOf2MonthsAgo.toISOString().split('T')[0];
    let currMonth = date.toISOString().split('T')[0];

    lineData.push({
        Date: new Date(firstMonth),
        Spending: data.month3Value,
    });
    lineData.push({
        Date: new Date(secondMonth),
        Spending: data.month2Value,
    });
    lineData.push({
        Date: new Date(currMonth),
        Spending: data.monthCurrValue,
    })


    onMount(() => {
    let divSelect = document.querySelector('.displayBox')
    if(divSelect)
    {
        let lineGraph = Plot.plot({marks: [
            Plot.frame({fill: "#ffffff"}),
            Plot.gridX({fill: "black"}),
            Plot.gridY({fill: "black"}),
            Plot.axisY({color:"white"}),
            Plot.axisX({ticks: "month", tickFormat:"  %b '%y", marginBottom: 40, color:"white"}),
            Plot.areaY(lineData, {x: "Date", y: "Spending", fillOpacity: 0.3, fill:"#D55E00"}),
            Plot.lineY(lineData, {x: "Date", y: "Spending", stroke:"#D55E00", tip:true}),
            ]
        })
        divSelect.append(lineGraph);
    } 
    

    var tooltip = d3.select(".displayBox")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#FFFFFF")
        .style("border", "1px solid #313639")
		.style("color", "#000")
		.style("padding", ".5rem")
		.style("border-radius", "8px")
        .text("a simple tooltip");
    d3.select('.data')
		.selectAll('#slices')
	    .on('mouseover', function(d, i){
        d3.select(this).transition()
            .duration('50')
            .attr('opacity', '.65')
		    //console.log(d3.select(this).attr("data"));
		    let value = Number(d3.select(this).attr("data"));
		    tooltip.text("$" + value.toLocaleString());
		    tooltip.style("visibility", "visible")
		    tooltip.style("top", (d.pageY-10)+"px").style("left",(d.pageX+10)+"px");
	    })
	    .on('mouseout', function(d, i){
        d3.select(this).transition()
            .duration('50')
            .attr('opacity', '1')
		    tooltip.style("visibility", "hidden")
	     })
  });


</script>

<div class = "displayBox">
<h2 id="pieheader">Monthly Spending by Category

<div id="pie">
<PieChart {data}/>
</div>
</h2>
</div>
<style lang="scss">
    h2 {
        color: $white;
    }
    .displayBox
    {
        width: 100vw;
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: center;
        align-content: space-around;
    }
    .displayBox > #pieheader
    {
        text-align: center;
    }
    .displayBox > #separate
    {
        margin-bottom: 30px;
    }
    .displayBox > #pie
    {
        align-self: auto;
        margin: 4px;
    }
</style>
