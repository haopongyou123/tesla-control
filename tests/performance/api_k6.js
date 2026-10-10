import http from 'k6/http';
import { check } from 'k6';

export let options = { vus: 10, duration: '30s' };
export default function () {
  const res = http.get('http://localhost:4000/api/tenants');
  check(res, { 'status 200': (r) => r.status === 200 });
}
