import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval('clear-stale-presence', { minutes: 5 }, internal.presence.clearStalePresence);

export default crons;
