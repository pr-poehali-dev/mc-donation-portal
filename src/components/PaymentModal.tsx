import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  amount: number;
}

export default function PaymentModal({ isOpen, onClose, packageName, amount }: PaymentModalProps) {
  const { toast } = useToast();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch(`https://functions.poehali.dev/5c11e53e-b3b8-4b92-aa21-b00168a6bbbf?amount=${amount}&package=${encodeURIComponent(packageName)}`)
        .then(res => res.json())
        .then(data => {
          setPaymentData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Payment data error:', err);
          setLoading(false);
        });
    }
  }, [isOpen, amount, packageName]);

  const copyPhone = () => {
    if (paymentData?.phone) {
      navigator.clipboard.writeText(paymentData.phone);
      toast({
        title: 'Номер скопирован! 📱',
        description: 'Можешь вставить в приложение банка',
      });
    }
  };

  const copyAmount = () => {
    if (paymentData?.amount) {
      navigator.clipboard.writeText(paymentData.amount);
      toast({
        title: 'Сумма скопирована! 💰',
        description: `${paymentData.amount}₽ в буфере обмена`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="CreditCard" className="text-primary" />
            Оплата пакета {packageName}
          </DialogTitle>
          <DialogDescription>
            Переведи {amount}₽ по СБП и привилегии активируются автоматически
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Icon name="Loader2" className="animate-spin text-primary" size={32} />
          </div>
        ) : paymentData ? (
          <div className="space-y-4">
            <div className="bg-primary/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Банк получателя</p>
                  <p className="font-semibold text-lg">{paymentData.bank}</p>
                </div>
                <Icon name="Building2" className="text-primary" size={24} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Номер телефона</p>
                  <p className="font-mono font-semibold text-lg">{paymentData.phone}</p>
                </div>
                <Button size="sm" variant="outline" onClick={copyPhone}>
                  <Icon name="Copy" size={16} />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Сумма</p>
                  <p className="font-bold text-2xl text-accent">{paymentData.amount}₽</p>
                </div>
                <Button size="sm" variant="outline" onClick={copyAmount}>
                  <Icon name="Copy" size={16} />
                </Button>
              </div>
            </div>

            <div className="bg-secondary/10 rounded-lg p-4 border-2 border-secondary">
              <div className="flex items-start gap-3">
                <Icon name="Info" className="text-secondary flex-shrink-0 mt-1" size={20} />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Как оплатить:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Открой приложение своего банка</li>
                    <li>Выбери "Перевод по номеру телефона"</li>
                    <li>Укажи номер {paymentData.phone}</li>
                    <li>Переведи {paymentData.amount}₽</li>
                    <li>В комментарии укажи свой ник на сервере</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-accent/10 rounded-lg p-4 border border-accent/30">
              <div className="flex items-start gap-3">
                <Icon name="Sparkles" className="text-accent flex-shrink-0 mt-1" size={20} />
                <p className="text-sm text-muted-foreground">
                  После оплаты привилегии активируются в течение 5 минут. Если возникнут вопросы — пиши в поддержку!
                </p>
              </div>
            </div>

            <Button className="w-full" onClick={onClose}>
              <Icon name="Check" size={18} />
              Понятно, оплачу!
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="AlertCircle" className="text-destructive mx-auto mb-2" size={32} />
            <p className="text-muted-foreground">Ошибка загрузки данных</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
