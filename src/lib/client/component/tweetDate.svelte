<script lang="ts">
    export let data: Date;
    export const day = data.toString().slice(3,10) + ", " + data.toString().slice(11,15);
    export const hour = data.toString().slice(15,21); 
    export const hour_am_pm = parseInt(hour.slice(1,3)) >= 12 ? 'PM' : 'AM';
</script>

<div class="date">
    {hour + ' ' +hour_am_pm +' ·' + day}
</div>

<style>
    .date{
        color: var(--c-slate-50);
        margin: 0;
        font-size: 12px;
    }
</style>