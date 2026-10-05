import React from 'react';

export default function Card({
  children,
  title,
  subtitle,
  action,
  icon: Icon,
  className = '',
  bodyClassName = 'p-5',
  headerClassName = 'px-5 py-3.5 border-b border-slate-100',
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden transition-all ${className}`}
      {...props}
    >
      {(title || subtitle || action || Icon) && (
        <div className={`flex items-center justify-between ${headerClassName}`}>
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/60">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-slate-800 text-sm tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 font-normal">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>
        {children}
      </div>
    </div>
  );
}
