'use client';

import { motion } from 'framer-motion';

const sidebarItems = ['Dashboard', 'Finance', 'HR', 'Logistics', 'Projects', 'DMS'];
const kpis = [
  { label: 'Budget used', value: '72%', trend: '+4%' },
  { label: 'Pending approvals', value: '18', trend: '-3' },
  { label: 'Active projects', value: '24', trend: '+2' },
];
const bars = [65, 82, 45, 90, 58, 76, 88, 52];

export default function CoyaDashboardMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative w-full max-w-2xl mx-auto lg:mx-0"
    >
      <motion.div className="absolute -inset-4 bg-brand-accent/20 blur-3xl rounded-3xl" />
      <motion.div className="relative glass-panel rounded-2xl overflow-hidden shadow-card animate-float">
        <motion.div className="flex items-center gap-2 px-4 py-3 border-b border-brand-border/60 bg-brand-slate/80">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-amber-400/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-3 text-xs text-brand-muted font-mono">coya.impulcia.app</span>
        </motion.div>
        <motion.div className="flex min-h-[320px]">
          <aside className="hidden sm:block w-36 border-r border-brand-border/40 bg-brand-navy/50 p-3 space-y-1">
            {sidebarItems.map((item, i) => (
              <motion.div
                key={item}
                className={`text-xs px-2 py-1.5 rounded-md ${i === 0 ? 'bg-brand-accent/20 text-brand-accent font-medium' : 'text-brand-muted'}`}
              >
                {item}
              </motion.div>
            ))}
          </aside>
          <motion.div className="flex-1 p-4 space-y-4">
            <motion.div className="grid grid-cols-3 gap-2">
              {kpis.map((kpi) => (
                <motion.div key={kpi.label} className="rounded-lg bg-brand-slate/60 border border-brand-border/40 p-2.5">
                  <p className="text-[10px] text-brand-muted truncate">{kpi.label}</p>
                  <p className="text-lg font-bold text-white">{kpi.value}</p>
                  <p className="text-[10px] text-brand-accent">{kpi.trend}</p>
                </motion.div>
              ))}
            </motion.div>
            <motion.div className="rounded-lg bg-brand-slate/60 border border-brand-border/40 p-3">
              <p className="text-xs text-brand-muted mb-2">Operational performance</p>
              <motion.div className="flex items-end gap-1 h-16">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                    className="flex-1 rounded-sm bg-gradient-to-t from-brand-accent/40 to-brand-accent"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </motion.div>
            </motion.div>
            <motion.div className="grid grid-cols-2 gap-2">
              <motion.div className="rounded-lg bg-brand-slate/60 border border-brand-border/40 p-2">
                <p className="text-[10px] text-brand-muted">Workflows</p>
                <motion.div className="mt-1 space-y-1">
                  {['Purchase request', 'CEO approval', 'Purchase order'].map((w) => (
                    <motion.div key={w} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                      <span className="text-[10px] text-slate-300 truncate">{w}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
              <motion.div className="rounded-lg bg-brand-slate/60 border border-brand-border/40 p-2 flex items-center justify-center">
                <motion.div className="w-14 h-14 rounded-full border-4 border-brand-accent/30 border-t-brand-accent animate-spin" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
