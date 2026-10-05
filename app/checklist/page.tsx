import { Bar } from '../Viewer';
import Checklist from './Checklist';

export const metadata = { title: '9Lab · Brief checklist' };

export default function Page() {
  return (
    <>
      <Bar current="/checklist/" />
      <Checklist />
    </>
  );
}
