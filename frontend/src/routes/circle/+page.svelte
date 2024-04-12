<script>
	import PieChart from './PieChart.svelte';
    export let data; //this line is absolutely necessary
</script>

<PieChart {data} /> <!--adds the pie chart onto the screen-->