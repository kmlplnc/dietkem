import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { ProfileInfo } from './tabs/ProfileInfo';
import { Measurements } from './tabs/Measurements';
import { MealPlans } from './tabs/MealPlans';
import { Logs } from './tabs/Logs';
import { Notes } from './tabs/Notes';

export const ClientProfile = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="measurements">Ölçümler</TabsTrigger>
          <TabsTrigger value="meal-plans">Beslenme Planları</TabsTrigger>
          <TabsTrigger value="logs">Günlükler</TabsTrigger>
          <TabsTrigger value="notes">Notlar</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileInfo />
        </TabsContent>
        <TabsContent value="measurements">
          <Measurements />
        </TabsContent>
        <TabsContent value="meal-plans">
          <MealPlans />
        </TabsContent>
        <TabsContent value="logs">
          <Logs />
        </TabsContent>
        <TabsContent value="notes">
          <Notes />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 