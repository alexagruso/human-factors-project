<script lang="ts">
    import PieChart from "../../circle/PieChart.svelte";
    import type { PageData } from "./$types";
    import * as d3 from "d3";
	import { onMount } from 'svelte';
    export let data: PageData;

    onMount(() => {
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

<h2>Monthly Spending by Category</h2>
<div class = "displayBox">
<PieChart {data} />
</div>
<style lang="scss">
    h2 {
        color: $white;
    }
</style>
