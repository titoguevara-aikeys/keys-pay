'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AdminShell from '@/components/admin/AdminShell';

type Role = 'viewer' | 'editor' | 'approver' | 'admin';
type Row = { 
  id: number; 
  locale: 'en' | 'ar'; 
  text: string; 
  position: number; 
  is_active: boolean; 
  status: 'draft' | 'published'; 
  publish_at: string | null 
};

function RowItem({ 
  row, 
  onChange, 
  selected, 
  onSelect, 
  disabled 
}: {
  row: Row; 
  onChange: (r: Row) => void; 
  selected: boolean; 
  onSelect: (id: number, sel: boolean) => void; 
  disabled: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.id });
  const style = { 
    transform: CSS.Transform.toString(transform), 
    transition, 
    opacity: disabled ? 0.6 : 1 
  };
  
  return (
    <tr ref={setNodeRef} style={style} className="border-t bg-background">
      <td className="py-2 pr-2">
        <input 
          type="checkbox" 
          checked={selected} 
          onChange={e => onSelect(row.id, e.target.checked)} 
          disabled={disabled}
        />
      </td>
      <td className="pr-2">
        <button 
          className="cursor-grab rounded border px-2 py-1 disabled:cursor-not-allowed" 
          {...attributes} 
          {...listeners} 
          title="Drag" 
          disabled={disabled}
        >
          ↕
        </button>
      </td>
      <td className="pr-2 text-xs">{row.id}</td>
      <td className="pr-2">
        <select 
          className="rounded border px-2 py-1" 
          value={row.locale} 
          onChange={e => onChange({...row, locale: e.target.value as 'en' | 'ar'})} 
          disabled={disabled}
        >
          <option value="en">en</option>
          <option value="ar">ar</option>
        </select>
      </td>
      <td className="pr-2 w-full">
        <input 
          className="w-full rounded border px-2 py-1" 
          value={row.text} 
          onChange={e => onChange({...row, text: e.target.value})} 
          disabled={disabled}
        />
      </td>
      <td className="pr-2 w-28">
        <input 
          type="number" 
          className="w-24 rounded border px-2 py-1" 
          value={row.position} 
          onChange={e => onChange({...row, position: +e.target.value})} 
          disabled={disabled}
        />
      </td>
      <td className="pr-2">
        <select 
          className="rounded border px-2 py-1" 
          value={row.status} 
          onChange={e => onChange({...row, status: e.target.value as Row['status']})} 
          disabled={disabled}
        >
          <option value="draft">draft</option>
          <option value="published">published</option>
        </select>
      </td>
      <td className="pr-2">
        <input 
          type="datetime-local" 
          className="rounded border px-2 py-1" 
          value={row.publish_at ? row.publish_at.slice(0,16) : ''} 
          onChange={e => onChange({
            ...row, 
            publish_at: e.target.value ? new Date(e.target.value).toISOString() : null
          })} 
          disabled={disabled}
        />
      </td>
      <td className="pr-2 text-center">
        <input 
          type="checkbox" 
          checked={row.is_active} 
          onChange={e => onChange({...row, is_active: e.target.checked})} 
          disabled={disabled}
        />
      </td>
    </tr>
  );
}

export default function TaglinesAdmin() {
  const { t } = useTranslation();
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<Role>('viewer');
  const [rows, setRows] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [filterLocale, setFilterLocale] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    supabase.auth.getSession().then(({data}) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    (async () => {
      if (!session?.user?.email) return;
      const { data } = await supabase
        .from('admin_users')
        .select('role, active')
        .eq('email', session.user.email)
        .maybeSingle();
      if (data?.active && data?.role) setRole(data.role as Role);
    })();
  }, [session]);

  const sensors = useSensors(useSensor(PointerSensor, {activationConstraint: {distance: 8}}));

  async function load() {
    const {data, error} = await supabase
      .from('taglines')
      .select('*')
      .order('locale', {ascending: true})
      .order('position', {ascending: true});
    if (error) alert(error.message); 
    else setRows(data as Row[]);
  }
  
  useEffect(() => { 
    if (session) load(); 
  }, [session]);

  const filtered = useMemo(() => rows.filter(r => r.locale === filterLocale), [rows, filterLocale]);

  const canEdit = role === 'editor' || role === 'approver' || role === 'admin';
  const canPublish = role === 'approver' || role === 'admin';
  const canDelete = role === 'admin';

  function onDragEnd(e: any) {
    if (!canEdit) return;
    const {active, over} = e;
    if (!over || active.id === over.id) return;
    const oldIndex = filtered.findIndex(r => r.id === active.id);
    const newIndex = filtered.findIndex(r => r.id === over.id);
    const reordered = arrayMove(filtered, oldIndex, newIndex).map((r, idx) => ({...r, position: (idx+1)*10}));
    setRows(prev => { 
      const others = prev.filter(r => r.locale !== filterLocale); 
      return [...others, ...reordered].sort((a,b) => 
        a.locale === b.locale ? a.position - b.position : a.locale.localeCompare(b.locale)
      ); 
    });
  }

  function updateRow(newRow: Row) { 
    setRows(prev => prev.map(r => r.id === newRow.id ? newRow : r)); 
  }
  
  function selectRow(id: number, sel: boolean) { 
    setSelected(prev => ({...prev, [id]: sel})); 
  }

  async function add(localeVal: 'en' | 'ar') {
    if (!canEdit) return alert('Not allowed');
    const { data, error } = await supabase
      .from('taglines')
      .insert({
        locale: localeVal, 
        text: 'New tagline', 
        position: 999, 
        is_active: true, 
        status: 'draft', 
        publish_at: null
      })
      .select()
      .single();
    if (error) return alert(error.message);
    setRows(prev => [...prev, data as Row]);
  }

  async function save(row: Row) {
    if (!canEdit) return alert('Not allowed');
    if (row.status === 'published' && !canPublish) return alert('Only approver/admin can publish.');
    const { error } = await supabase
      .from('taglines')
      .update({ 
        text: row.text, 
        position: row.position, 
        is_active: row.is_active, 
        status: row.status, 
        publish_at: row.publish_at 
      })
      .eq('id', row.id);
    if (error) alert(error.message); 
    else alert('Saved.');
  }

  async function saveOrder() {
    if (!canEdit) return alert('Not allowed');
    const toSave = rows.filter(r => r.locale === filterLocale).sort((a,b) => a.position - b.position);
    for (const r of toSave) { 
      const { error } = await supabase
        .from('taglines')
        .update({ position: r.position })
        .eq('id', r.id); 
      if (error) return alert(error.message); 
    }
    alert('Order saved.');
  }

  function selectedIds(): number[] { 
    return Object.entries(selected).filter(([,v]) => v).map(([k]) => +k); 
  }

  async function bulkUpdate(partial: Partial<Row>) {
    if (!canEdit) return alert('Not allowed');
    if (partial.status === 'published' && !canPublish) return alert('Only approver/admin can publish.');
    const ids = selectedIds(); 
    if (!ids.length) return alert('Select at least one row.');
    const { error } = await supabase.from('taglines').update(partial).in('id', ids);
    if (error) alert(error.message); 
    else { alert('Updated.'); load(); setSelected({}); }
  }

  async function bulkDelete() {
    if (!canDelete) return alert('Not allowed');
    const ids = selectedIds(); 
    if (!ids.length) return alert('Select at least one row.');
    const { error } = await supabase.from('taglines').delete().in('id', ids);
    if (error) alert(error.message); 
    else { alert('Deleted.'); load(); setSelected({}); }
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">
            {t('admin.title')} <span className="text-sm text-muted-foreground">({role})</span>
          </h1>
          <div className="flex items-center gap-2">
            <label className="text-sm">{t('admin.locale')}:</label>
            <select 
              className="rounded border px-2 py-1" 
              value={filterLocale} 
              onChange={e => setFilterLocale(e.target.value as 'en' | 'ar')}
            >
              <option value="en">en</option>
              <option value="ar">ar</option>
            </select>
            <button 
              onClick={() => add('en')} 
              className="rounded bg-primary px-3 py-1 text-primary-foreground disabled:opacity-50" 
              disabled={!canEdit}
            >
              {t('admin.add')} EN
            </button>
            <button 
              onClick={() => add('ar')} 
              className="rounded bg-primary px-3 py-1 text-primary-foreground disabled:opacity-50" 
              disabled={!canEdit}
            >
              {t('admin.add')} AR
            </button>
          </div>
        </div>

        <div className="rounded border">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr className="text-left">
                <th className="py-2 pl-2 w-8"></th>
                <th className="w-12"></th>
                <th className="w-16">ID</th>
                <th className="w-20">{t('admin.locale')}</th>
                <th className="">{t('admin.text')}</th>
                <th className="w-32">{t('admin.position')}</th>
                <th className="w-36">{t('admin.status')}</th>
                <th className="w-56">{t('admin.schedule')}</th>
                <th className="w-20 text-center">{t('admin.active')}</th>
              </tr>
            </thead>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={filtered.map(r => r.id)} strategy={verticalListSortingStrategy}>
                <tbody>
                  {filtered.sort((a,b) => a.position - b.position).map((r) => (
                    <RowItem 
                      key={r.id} 
                      row={r} 
                      selected={!!selected[r.id]} 
                      onSelect={selectRow} 
                      onChange={(row) => save(row)} 
                      disabled={!canEdit} 
                    />
                  ))}
                </tbody>
              </SortableContext>
            </DndContext>
          </table>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => bulkUpdate({status:'published', is_active:true, publish_at:new Date().toISOString()})} 
            className="rounded bg-green-600 px-3 py-1 text-white disabled:opacity-50" 
            disabled={!canPublish}
          >
            {t('admin.publish')}
          </button>
          <button 
            onClick={() => bulkUpdate({status:'draft'})} 
            className="rounded bg-yellow-500 px-3 py-1 text-white disabled:opacity-50" 
            disabled={!canEdit}
          >
            {t('admin.draft')}
          </button>
          <button 
            onClick={() => bulkDelete()} 
            className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50" 
            disabled={!canDelete}
          >
            {t('admin.delete')}
          </button>
          <button 
            onClick={() => saveOrder()} 
            className="rounded bg-primary px-3 py-1 text-primary-foreground disabled:opacity-50" 
            disabled={!canEdit}
          >
            {t('admin.saveOrder')}
          </button>
        </div>

        <div className="text-xs text-muted-foreground">
          Tip: drag rows to reorder. Positions save in steps of 10 for easy inserts.
        </div>
      </div>
    </AdminShell>
  );
}