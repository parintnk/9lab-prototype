import { Bar } from '../Viewer';
import Journey from './Journey';

export const metadata = { title: '9Lab · Customer journey' };

export default function Page() {
  return (
    <>
      <Bar current="/journey/" />
      <Journey />
    </>
  );
}
