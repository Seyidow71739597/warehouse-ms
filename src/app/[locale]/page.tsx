import { getDashboardStats } from "@/actions/dashboard";
import { DashboardChart } from "@/components/DashboardChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, AlertTriangle, Layers, ArrowUpRight, ArrowDownLeft } from "lucide-react"; // Wallet yerine Layers geldi

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      
      {/* BAŞLIK */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Ammar Sistemasy </h1>
        <p className="text-slate-500 mt-1">Ine, ambaryň umumy ýagdaýy.</p>
      </div>

      {/* İSTATİSTİK KARTLARI */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* 1. KART: TOPLAM STOK ADEDİ (PARA YOK) */}
        <Card className="shadow-lg shadow-blue-100 border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Jemi Stok Sany</CardTitle>
            {/* Cüzdan gitti, Katmanlar geldi */}
            <Layers className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {stats.totalStockItems.toLocaleString()} <span className="text-sm font-medium text-blue-400">Sany</span>
            </div>
            <p className="text-xs text-blue-600/70 mt-1 font-medium">Ambardaky ähli harytlar</p>
          </CardContent>
        </Card>

        {/* 2. KART: ÜRÜN ÇEŞİDİ */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Haryt Görnüşi</CardTitle>
            <Package className="h-5 w-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalProducts}</div>
            <p className="text-xs text-slate-500 mt-1">Jemi hasaba alnan kartlar</p>
          </CardContent>
        </Card>

        {/* 3. KART: KRİTİK STOK */}
        <Card className="shadow-sm border-amber-200 bg-amber-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Kritik Stok</CardTitle>
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{stats.lowStockCount}</div>
            <p className="text-xs text-amber-700 mt-1">Dynyp gelýän harytlar</p>
          </CardContent>
        </Card>

        {/* 4. KART: PARTNERLER */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Hyzmatdaşlar</CardTitle>
            <Users className="h-5 w-5 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalPartners}</div>
            <p className="text-xs text-slate-500 mt-1">Müşderi we Üpjünçiler</p>
          </CardContent>
        </Card>
      </div>

      {/* GRAFİK VE LİSTE */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        <Card className="col-span-4 shadow-md border-slate-200">
          <CardHeader>
            <CardTitle>Hereketleriň Grafikasy</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <DashboardChart />
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-md border-slate-200">
          <CardHeader>
            <CardTitle>Soňky Hereketler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.recentTransactions.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">Heniz hiç hili hereket ýok.</p>
              ) : (
                stats.recentTransactions.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center gap-3">
                      
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        tx.type === "IN" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                      }`}>
                        {tx.type === "IN" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none text-slate-900">
                          {tx.product?.name || "Silinen Haryt"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {tx.partner?.name || "Belli Däl"} • {new Date(tx.createdAt).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                    </div>

                    <div className={`font-bold ${tx.type === "IN" ? "text-emerald-600" : "text-red-600"}`}>
                      {tx.type === "IN" ? "+" : "-"}{tx.quantity}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}