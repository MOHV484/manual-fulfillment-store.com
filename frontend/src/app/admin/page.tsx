'use client';

import React, { useState } from 'react';
import { playBeep } from '../../lib/sound'; // استدعاء نغمة التنبيه الخاصة بالنظام

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // بيانات محاكاة تفاعلية لحين ربطها بقاعدة البيانات بالكامل
  const stats = {
    totalSales: '$4,850.00',
    pendingOrders: 12,
    activeUsers: 142,
    walletDeposits: '$1,200.00'
  };

  const recentOrders = [
    { id: 'ORD-9021', customer: 'أحمد علي', product: 'PUBG Mobile 660 UC', price: '$10.00', status: 'Pending' },
    { id: 'ORD-9020', customer: 'محمد الصادق', product: 'Razer Gold $50', price: '$50.00', status: 'Completed' },
    { id: 'ORD-9019', customer: 'خالد عمر', product: 'Free Fire 1080 Diamonds', price: '$15.00', status: 'Rejected' },
  ];

  const handleNotificationClick = () => {
    playBeep(); // تشغيل صوت التنبيه الفيزيائي لإشعار الإدارة
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      
      {/* القائمة الجانبية (Sidebar) */}
      <aside className="w-64 bg-slate-900 border-l border-slate-800/80 flex flex-col justify-between" dir="rtl">
        <div className="p-6">
          <div className="flex items-center space-x-3 space-x-reverse mb-8">
            {/* أيقونة الشعار الاحترافية - درع الأمان */}
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              RAIZ3Y STORE
            </h1>
          </div>
          
          <nav className="space-y-1">
            {[
              { 
                id: 'dashboard', 
                label: 'لوحة التحكم', 
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                  </svg>
                )
              },
              { 
                id: 'orders', 
                label: 'إدارة الطلبات', 
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )
              },
              { 
                id: 'products', 
                label: 'المنتجات والشدات', 
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                )
              },
              { 
                id: 'wallets', 
                label: 'المحافظ الإلكترونية', 
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                )
              },
              { 
                id: 'users', 
                label: 'المستخدمين والتوثيق', 
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl transition-all duration-200 text-right ${
                  activeTab === item.id 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold' 
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        {/* أسفل القائمة الجانبية - معلومات الهوية والأمان */}
        <div className="p-6 border-t border-slate-800/80">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-sm">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">المشرف العام</p>
              <p className="text-[10px] text-slate-500 font-mono">ID: #88921</p>
            </div>
          </div>
        </div>
      </aside>

      {/* المحتوى الرئيسي للوحة التحكم */}
      <main className="flex-1 flex flex-col overflow-y-auto" dir="rtl">
        
        {/* الشريط العلوي (Header) */}
        <header className="h-20 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-8">
          <div>
            <h2 className="text-lg font-bold text-slate-100">لوحة تحكم الأنظمة والأمان</h2>
            <p className="text-xs text-slate-500 mt-1">مراقبة العمليات والتحقق الفوري من المعاملات المالية والطلبات</p>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* زر التنبيهات الصوتي الاحترافي */}
            <button 
              onClick={handleNotificationClick}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl relative transition-all duration-200"
              title="اختبار جرس الإنذار الصوتي"
            >
              <svg className="w-5 h-5 text-slate-400 hover:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            </button>
            
            <div className="flex items-center space-x-2 space-x-reverse px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[11px] text-emerald-400 font-bold tracking-wide">الخادم متصل</span>
            </div>
          </div>
        </header>

        {/* جسم الصفحة الرئيسي */}
        <div className="p-8 space-y-8">
          
          {/* كروت الإحصائيات السريعة */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800/60 relative overflow-hidden">
              <div className="absolute top-4 left-4 text-emerald-500/10">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="text-slate-500 text-xs font-semibold">إجمالي الإيرادات</p>
              <h3 className="text-2xl font-bold mt-3 text-emerald-400 font-mono">{stats.totalSales}</h3>
              <p className="text-[10px] text-slate-500 mt-2 flex items-center">
                <span className="text-emerald-500 font-semibold ml-1">↑ +12%</span> مقارنة بالأسبوع الماضي
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800/60 relative overflow-hidden">
              <div className="absolute top-4 left-4 text-amber-500/10">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-500 text-xs font-semibold">طلبات معلقة للتسليم</p>
              <h3 className="text-2xl font-bold mt-3 text-amber-500 font-mono">{stats.pendingOrders}</h3>
              <p className="text-[10px] text-slate-500 mt-2">تتطلب مراجعة فورية وشحن يدوي</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800/60 relative overflow-hidden">
              <div className="absolute top-4 left-4 text-blue-500/10">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-slate-500 text-xs font-semibold">المستخدمين النشطين</p>
              <h3 className="text-2xl font-bold mt-3 text-blue-400 font-mono">{stats.activeUsers}</h3>
              <p className="text-[10px] text-slate-500 mt-2">أصحاب الحسابات الموثقة والنشطة</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800/60 relative overflow-hidden">
              <div className="absolute top-4 left-4 text-indigo-500/10">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-slate-500 text-xs font-semibold">إيداعات معلقة للشحن</p>
              <h3 className="text-2xl font-bold mt-3 text-indigo-400 font-mono">{stats.walletDeposits}</h3>
              <p className="text-[10px] text-slate-500 mt-2">بانتظار التحقق من إشعار التحويل</p>
            </div>

          </div>

          {/* تبويب لوحة التحكم الرئيسي */}
          {activeTab === 'dashboard' && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800/60 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-md font-bold text-slate-200">العمليات والطلبات الأخيرة</h3>
                <button className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center space-x-1 space-x-reverse">
                  <span>عرض الكل</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-semibold">
                      <th className="pb-4 pr-4">رقم المعاملة</th>
                      <th className="pb-4">اسم العميل</th>
                      <th className="pb-4">المنتج / العملية</th>
                      <th className="pb-4">المبلغ الإجمالي</th>
                      <th className="pb-4">حالة النظام</th>
                      <th className="pb-4 pl-4 text-left">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/10 transition duration-150">
                        <td className="py-4 pr-4 font-mono text-slate-400 text-[11px]">{order.id}</td>
                        <td className="py-4 font-medium text-slate-200">{order.customer}</td>
                        <td className="py-4 text-slate-300">{order.product}</td>
                        <td className="py-4 font-bold text-blue-400 font-mono">{order.price}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center space-x-1.5 space-x-reverse px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            order.status === 'Completed' ? 'bg-emerald-500/5 text-emerald-400 border border-emerald-500/10' :
                            order.status === 'Pending' ? 'bg-amber-500/5 text-amber-400 border border-amber-500/10' :
                            'bg-rose-500/5 text-rose-400 border border-rose-500/10'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              order.status === 'Completed' ? 'bg-emerald-500' :
                              order.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                            }`}></span>
                            <span>
                              {order.status === 'Completed' ? 'تم الشحن والتدقيق' :
                               order.status === 'Pending' ? 'معلق بانتظار التأكيد' : 'مرفوض ومسترد'}
                            </span>
                          </span>
                        </td>
                        <td className="py-4 pl-4 text-left">
                          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold transition duration-150">
                            مراجعة الطلب
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* التبويبات الأخرى قيد البرمجة والربط */}
          {activeTab !== 'dashboard' && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800/60 p-12 text-center">
              <div className="w-12 h-12 bg-slate-800/80 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
                <svg className="w-6 h-6 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-md font-bold text-slate-200">قسم {activeTab} قيد الاتصال التقني</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                نقوم الآن بتجهيز الدوال والاتصالات البرمجية مع قاعدة بيانات Supabase والـ API لتهيئة هذا المكون للعمل بشكل فوري وبكامل الحماية.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
