
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar as CalendarIcon, Home, User, CreditCard, Wrench, FileText } from 'lucide-react';

// Type pour les événements
export type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  type: 'payment' | 'maintenance' | 'lease' | 'document';
  description?: string;
  propertyId?: string;
  tenantId?: string;
};

// Exemple d'événements (en pratique, ces données viendraient de l'API)
export const generateMockEvents = (): CalendarEvent[] => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  return [
    {
      id: '1',
      title: 'Paiement de loyer',
      date: new Date(currentYear, currentMonth, 5),
      type: 'payment',
      description: 'Loyer mensuel pour Appartement Paris',
      propertyId: 'property1',
    },
    {
      id: '2',
      title: 'Maintenance programmée',
      date: new Date(currentYear, currentMonth, 12),
      type: 'maintenance',
      description: 'Vérification de la chaudière',
      propertyId: 'property2',
    },
    {
      id: '3',
      title: 'Fin de bail',
      date: new Date(currentYear, currentMonth, 20),
      type: 'lease',
      description: 'Fin du bail de M. Dupont',
      propertyId: 'property1',
      tenantId: 'tenant1',
    },
    {
      id: '4',
      title: 'Renouvellement assurance',
      date: new Date(currentYear, currentMonth, 28),
      type: 'document',
      description: 'Renouvellement de l\'assurance habitation',
      propertyId: 'property3',
    },
    {
      id: '5',
      title: 'Paiement de loyer',
      date: new Date(currentYear, currentMonth + 1, 5),
      type: 'payment',
      description: 'Loyer mensuel pour Appartement Lyon',
      propertyId: 'property3',
    },
  ];
};

// Composant principal
const EventCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events] = useState<CalendarEvent[]>(generateMockEvents());
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fonction pour vérifier si une date a des événements
  const hasEvents = (day: Date) => {
    return events.some(event => 
      event.date.getDate() === day.getDate() && 
      event.date.getMonth() === day.getMonth() && 
      event.date.getFullYear() === day.getFullYear()
    );
  };

  // Fonction pour obtenir les événements d'une date spécifique
  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      event.date.getDate() === day.getDate() && 
      event.date.getMonth() === day.getMonth() && 
      event.date.getFullYear() === day.getFullYear()
    );
  };

  // Fonction pour afficher les événements d'un jour
  const handleDayClick = (day: Date) => {
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length > 0) {
      setSelectedEvents(dayEvents);
      setIsDialogOpen(true);
    }
  };

  // Icône en fonction du type d'événement
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4" />;
      case 'lease':
        return <User className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  // Classe de couleur en fonction du type d'événement
  const getEventColor = (type: string) => {
    switch (type) {
      case 'payment':
        return "bg-blue-100 text-blue-800";
      case 'maintenance':
        return "bg-amber-100 text-amber-800";
      case 'lease':
        return "bg-purple-100 text-purple-800";
      case 'document':
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Calendrier des événements</CardTitle>
        <CardDescription>Planifiez et suivez les dates importantes</CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
            if (newDate) handleDayClick(newDate);
          }}
          className="rounded-md border"
          locale={fr}
          modifiersClassNames={{
            today: 'bg-primary/10',
          }}
          components={{
            DayContent: ({ date }) => (
              <div className="relative">
                <div>{date.getDate()}</div>
                {hasEvents(date) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </div>
            ),
          }}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Événements du {date && format(date, 'dd MMMM yyyy', { locale: fr })}</DialogTitle>
              <DialogDescription>
                Détails des événements prévus pour cette date
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[50vh] mt-2">
              <div className="space-y-3 p-1">
                {selectedEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="p-3 border rounded-lg shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn("p-1.5 rounded-full", getEventColor(event.type))}>
                        {getEventIcon(event.type)}
                      </div>
                      <h4 className="font-medium">{event.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <div className="mt-2 flex items-center text-xs text-muted-foreground">
                      <Home className="h-3 w-3 mr-1" />
                      <span>{event.propertyId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EventCalendar;
