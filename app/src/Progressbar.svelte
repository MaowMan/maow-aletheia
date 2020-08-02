<script>
    export let maxvalue , value;
    import {Progress } from "svelma";
</script>

{#if maxvalue===null}
    <Progress type = "is-info"></Progress>
{:else}
    <Progress type = "is-info" max={maxvalue} value={value}></Progress>
{/if}