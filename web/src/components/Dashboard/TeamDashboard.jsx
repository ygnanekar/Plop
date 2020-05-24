import React from 'react';
import DragDropComponent from './DragDropComponent';
import { useActiveIssues } from '../../utility/hooks';

export default function TeamDashboard() {
  const [items, loading] = useActiveIssues('team');

  return <DragDropComponent itemsData={items} loading={loading} />;
}
