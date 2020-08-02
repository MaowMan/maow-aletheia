<script>
    export let meta;
    import { Field, Input ,Icon,Button} from 'svelma';
    import Download from "./Download.svelte";
    let code = "";
</script>

<section class="section">
    <div class="columns is-centered">
        <div class="column is-half">
            <Field label="輸入神的語言：">
                <Input icon="search"  bind:value={code} />
            </Field>
            <Download code={code} meta = {meta}></Download>
        </div>
    </div>
</section>