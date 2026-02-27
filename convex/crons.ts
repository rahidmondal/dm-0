import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval('clear-stale-presence', { hours: 168 }, internal.presence.clearStalePresence);

export default crons;
