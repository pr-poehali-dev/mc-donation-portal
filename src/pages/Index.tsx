import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const donationPackages = [
  {
    id: 1,
    name: 'Стартовый',
    price: 99,
    icon: 'Pickaxe',
    color: 'bg-gray-100 border-gray-300',
    features: [
      'Префикс [Starter]',
      'Набор инструментов',
      '32 алмаза',
      'Доступ к /home (2 дома)',
      'Цветной ник в чате'
    ]
  },
  {
    id: 2,
    name: 'VIP',
    price: 299,
    icon: 'Gem',
    color: 'bg-secondary/20 border-secondary',
    popular: true,
    features: [
      'Префикс [VIP]',
      'Алмазная броня',
      '64 алмаза + 16 изумрудов',
      'Доступ к /home (5 домов)',
      'Возможность летать',
      'Приват 50x50 блоков',
      'Кит раз в 12 часов'
    ]
  },
  {
    id: 3,
    name: 'PREMIUM',
    price: 599,
    icon: 'Crown',
    color: 'bg-accent/20 border-accent',
    features: [
      'Префикс [PREMIUM]',
      'Незеритовая броня',
      '128 алмазов + 64 изумруда',
      'Доступ к /home (10 домов)',
      'Возможность летать',
      'Приват 100x100 блоков',
      'Кит раз в 6 часов',
      'Доступ к /back',
      'Собственный варп'
    ]
  },
  {
    id: 4,
    name: 'LEGEND',
    price: 999,
    icon: 'Sparkles',
    color: 'bg-gradient-to-br from-accent/30 to-secondary/30 border-accent',
    features: [
      'Префикс [LEGEND]',
      'Полный комплект незерита',
      '256 алмазов + 128 изумрудов',
      'Неограниченные /home',
      'Возможность летать',
      'Приват 200x200 блоков',
      'Кит раз в 3 часа',
      'Доступ ко всем командам',
      '3 собственных варпа',
      'Уникальный партикл эффект'
    ]
  }
];

export default function Index() {
  const { toast } = useToast();
  const serverIP = 'server-mc.work.gd:25590';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(serverIP);
    toast({
      title: 'IP скопирован! 📋',
      description: 'Теперь можно зайти на сервер',
    });
  };

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-secondary/10 to-background">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg3NCwxNTYsNDUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="container relative mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-8 mb-16">
            <div className="inline-block animate-float">
              <div className="text-6xl sm:text-8xl mb-4">🧊</div>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold text-foreground tracking-tight">
              Донат на сервер
            </h1>
            
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-card/80 backdrop-blur-sm p-4 rounded-lg border-2 border-primary shadow-lg">
              <div className="flex items-center gap-2">
                <Icon name="Server" className="text-primary" size={24} />
                <code className="text-lg sm:text-xl font-semibold text-foreground">
                  {serverIP}
                </code>
              </div>
              <Button 
                onClick={copyToClipboard}
                variant="default"
                className="gap-2 font-semibold animate-pulse-glow"
              >
                <Icon name="Copy" size={18} />
                Копировать IP
              </Button>
            </div>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Поддержи сервер и получи эксклюзивные привилегии! 🎮
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {donationPackages.map((pkg) => (
              <Card 
                key={pkg.id}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${pkg.color} border-2`}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="default" className="bg-accent text-accent-foreground font-bold">
                      🔥 Популярный
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name={pkg.icon as any} className="text-primary" size={32} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
                  <CardDescription className="text-3xl font-bold text-foreground mt-2">
                    {pkg.price}₽
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Icon name="Check" className="text-primary flex-shrink-0 mt-0.5" size={16} />
                        <span className="text-card-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full font-bold text-base h-11"
                    variant={pkg.popular ? "default" : "outline"}
                  >
                    <Icon name="ShoppingCart" size={18} />
                    Купить
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-card/80 backdrop-blur-sm border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Icon name="Info" className="text-primary" />
                  Как получить донат?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <p className="text-muted-foreground pt-1">
                    Выбери подходящий пакет привилегий
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <p className="text-muted-foreground pt-1">
                    Нажми кнопку "Купить" и следуй инструкциям
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex-shrink-0 flex items-center justify-center font-bold">
                    3
                  </div>
                  <p className="text-muted-foreground pt-1">
                    После оплаты привилегии активируются автоматически на сервере
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="bg-card border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            Сделано с <Icon name="Heart" size={16} className="text-red-500 animate-pulse" /> для игроков
          </p>
        </div>
      </footer>
    </div>
  );
}
