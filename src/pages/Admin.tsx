import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Donation {
  id: number;
  player_nickname: string;
  package_name: string;
  amount: number;
  status: string;
  phone: string | null;
  created_at: string;
  notes: string | null;
}

export default function Admin() {
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDonations = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/1b13b9ff-6438-4d87-9ef4-27f20404e0d2');
      const data = await response.json();
      setDonations(data.donations || []);
    } catch (error) {
      console.error('Failed to load donations:', error);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить список донатов',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch('https://functions.poehali.dev/1b13b9ff-6438-4d87-9ef4-27f20404e0d2', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: 'Статус обновлён! ✅',
          description: `Платёж #${id} теперь "${newStatus}"`,
        });
        loadDonations();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: any; icon: string }> = {
      pending: { label: 'Ожидает', variant: 'secondary', icon: 'Clock' },
      completed: { label: 'Выполнен', variant: 'default', icon: 'CheckCircle' },
      cancelled: { label: 'Отменён', variant: 'destructive', icon: 'XCircle' },
    };

    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon name={config.icon as any} size={14} />
        {config.label}
      </Badge>
    );
  };

  const stats = {
    total: donations.length,
    pending: donations.filter(d => d.status === 'pending').length,
    completed: donations.filter(d => d.status === 'completed').length,
    revenue: donations
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + d.amount, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Icon name="LayoutDashboard" className="text-primary" />
              Админ-панель донатов
            </h1>
            <p className="text-muted-foreground mt-1">Управление платежами сервера</p>
          </div>
          <Button onClick={loadDonations} variant="outline">
            <Icon name="RefreshCw" size={18} />
            Обновить
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Всего заказов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Icon name="ShoppingCart" className="text-primary" size={24} />
                <span className="text-3xl font-bold">{stats.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                В обработке
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Icon name="Clock" className="text-secondary" size={24} />
                <span className="text-3xl font-bold">{stats.pending}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Выполнено
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Icon name="CheckCircle" className="text-primary" size={24} />
                <span className="text-3xl font-bold">{stats.completed}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Доход
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Icon name="Coins" className="text-accent" size={24} />
                <span className="text-3xl font-bold">{stats.revenue}₽</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="List" className="text-primary" />
              Список донатов
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Icon name="Loader2" className="animate-spin text-primary" size={32} />
              </div>
            ) : donations.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Inbox" className="text-muted-foreground mx-auto mb-3" size={48} />
                <p className="text-muted-foreground">Пока нет донатов</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Игрок</TableHead>
                      <TableHead>Пакет</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Телефон</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell className="font-mono">#{donation.id}</TableCell>
                        <TableCell className="font-semibold">{donation.player_nickname}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{donation.package_name}</Badge>
                        </TableCell>
                        <TableCell className="font-bold">{donation.amount}₽</TableCell>
                        <TableCell className="font-mono text-sm">{donation.phone || '—'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(donation.created_at).toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>{getStatusBadge(donation.status)}</TableCell>
                        <TableCell>
                          <Select
                            value={donation.status}
                            onValueChange={(value) => updateStatus(donation.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Ожидает</SelectItem>
                              <SelectItem value="completed">Выполнен</SelectItem>
                              <SelectItem value="cancelled">Отменён</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
