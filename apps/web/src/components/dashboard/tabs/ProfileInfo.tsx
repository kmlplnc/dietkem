import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/TextareaComponent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/SelectComponent';
import { trpc } from '@/utils/trpc';
import { useUser } from '@clerk/clerk-react';

interface ProfileInfoProps {
  client?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
    status: string;
  };
}

export const ProfileInfo = ({ client }: ProfileInfoProps) => {
  const { user } = useUser();
  const { isLoading } = trpc.users.me.useQuery();

  const [formData, setFormData] = useState({
    name: user?.firstName || '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    phone: client?.phone || '',
    address: client?.address || '',
    notes: client?.notes || '',
    status: client?.status || 'active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">İsim</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Durum</Label>
          <Select
            value={formData.status}
            onValueChange={(value: string) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Durum seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Pasif</SelectItem>
              <SelectItem value="pending">Beklemede</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adres</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notlar</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData({ ...formData, notes: e.target.value })
          }
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Kaydet</Button>
      </div>
    </form>
  );
}; 