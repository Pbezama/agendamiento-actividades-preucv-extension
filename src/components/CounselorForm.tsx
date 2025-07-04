
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Counselor, Executive } from '@/pages/Index';

interface CounselorFormProps {
  executive: Executive;
  onCounselorSaved: (counselor: Counselor) => void;
  onBack: () => void;
}

const positions = [
  'Orientador',
  'Psicólogo',
  'Trabajador Social',
  'Coordinador de Bienestar',
  'Psicopedagogo'
];

const regions = [
  'Región de Arica y Parinacota',
  'Región de Tarapacá',
  'Región de Antofagasta',
  'Región de Atacama',
  'Región de Coquimbo',
  'Región de Valparaíso',
  'Región Metropolitana',
  'Región del Libertador General Bernardo O\'Higgins',
  'Región del Maule',
  'Región de Ñuble',
  'Región del Biobío',
  'Región de La Araucanía',
  'Región de Los Ríos',
  'Región de Los Lagos',
  'Región Aysén del General Carlos Ibáñez del Campo',
  'Región de Magallanes y de la Antártica Chilena'
];

const avatarColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-teal-500'
];

export const CounselorForm = ({ executive, onCounselorSaved, onBack }: CounselorFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    email: '',
    phone: '',
    region: '',
    commune: '',
    school: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateAvatar = (name: string) => {
    const initials = name || 'OR';
    const acronym = initials.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const colorClass = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    return `${colorClass}|${acronym}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.position) {
      newErrors.position = 'Debes seleccionar un cargo';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = 'Ingresa un correo válido';
    }

    if (!formData.region) {
      newErrors.region = 'Debes seleccionar una región';
    }

    if (!formData.commune.trim()) {
      newErrors.commune = 'La comuna es obligatoria';
    }

    if (!formData.school.trim()) {
      newErrors.school = 'El colegio es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Oops! Faltan algunos datos",
        description: "Revisa los campos marcados en rojo",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const counselor: Counselor = {
      id: Date.now().toString(),
      ...formData,
      avatar: generateAvatar(formData.fullName || 'Orientador'),
      executiveId: executive.id
    };

    toast({
      title: "¡Orientador guardado con éxito! 🎉",
      description: `Datos guardados correctamente. Ahora vamos con las actividades.`,
    });

    setIsLoading(false);
    onCounselorSaved(counselor);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nuevo orientador</h1>
          <p className="text-muted-foreground">Ejecutiva: <strong>{executive.name}</strong></p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm">
            ✓
          </div>
          <span className="ml-2 text-sm text-muted-foreground">Ejecutiva</span>
        </div>
        <div className="flex-1 h-px bg-border mx-4" />
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
            2
          </div>
          <span className="ml-2 text-sm font-medium">Datos del orientador</span>
        </div>
        <div className="flex-1 h-px bg-border mx-4" />
        <div className="flex items-center">
          <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm">
            3
          </div>
          <span className="ml-2 text-sm text-muted-foreground">Actividades</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Información del orientador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Ej: María González López"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Cargo *</Label>
                <Select onValueChange={(value) => handleInputChange('position', value)}>
                  <SelectTrigger className={errors.position ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecciona un cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.position && (
                  <p className="text-sm text-destructive">{errors.position}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Ej: +56 9 1234 5678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Región *</Label>
                <Select onValueChange={(value) => handleInputChange('region', value)}>
                  <SelectTrigger className={errors.region ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecciona una región" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region && (
                  <p className="text-sm text-destructive">{errors.region}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="commune">Comuna *</Label>
                <Input
                  id="commune"
                  value={formData.commune}
                  onChange={(e) => handleInputChange('commune', e.target.value)}
                  placeholder="Ej: Santiago"
                  className={errors.commune ? 'border-destructive' : ''}
                />
                {errors.commune && (
                  <p className="text-sm text-destructive">{errors.commune}</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="school">Colegio *</Label>
                <Input
                  id="school"
                  value={formData.school}
                  onChange={(e) => handleInputChange('school', e.target.value)}
                  placeholder="Ej: Colegio San Francisco"
                  className={errors.school ? 'border-destructive' : ''}
                />
                {errors.school && (
                  <p className="text-sm text-destructive">{errors.school}</p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Guardar orientador
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
