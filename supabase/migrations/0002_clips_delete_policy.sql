create policy "clips_via_project_delete" on clips for delete using (
  exists (select 1 from projects where projects.id = clips.project_id and projects.user_id = auth.uid())
);
