
import React, { useState } from 'react';
import { FileText, Upload, Filter, Clock, Download, Search, Eye, Trash2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockDocuments, mockProperties } from '@/utils/mockData';
import { DocumentType } from '@/utils/types';
import { motion } from 'framer-motion';

const Documents = () => {
  const [documents] = useState(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Format date as DD/MM/YYYY
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  // Format file size in KB, MB, etc.
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get property name by ID
  const getPropertyName = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property ? property.name : 'N/A';
  };

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProperty = propertyFilter === 'all' || doc.propertyId === propertyFilter;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    
    return matchesSearch && matchesProperty && matchesType;
  });

  return (
    <>
      <Header />
      <PageTransition>
        <main className="page-container pb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="page-title">Documents</h1>
              <p className="text-muted-foreground">Gérez vos contrats, quittances et autres documents</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Ajouter un document
              </Button>
            </div>
          </div>

          {/* Search and filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Rechercher un document..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="sm:w-auto w-full justify-center"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
            </div>

            {showFilters && (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 bg-muted/10 p-4 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <label className="text-sm font-medium mb-2 block">Bien immobilier</label>
                  <Select 
                    value={propertyFilter} 
                    onValueChange={setPropertyFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filtrer par bien" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les biens</SelectItem>
                      {mockProperties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Type de document</label>
                  <Select 
                    value={typeFilter} 
                    onValueChange={setTypeFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filtrer par type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      {Object.values(DocumentType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </div>

          {/* Documents table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Bien immobilier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-primary" />
                          {doc.name}
                          {doc.expiryDate && new Date(doc.expiryDate) < new Date() && (
                            <span className="ml-2 px-2 py-0.5 bg-destructive/10 text-destructive text-xs rounded-full">
                              Expiré
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{getPropertyName(doc.propertyId)}</TableCell>
                        <TableCell className="flex items-center">
                          <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                          {formatDate(doc.uploadDate)}
                        </TableCell>
                        <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Aperçu du document</DialogTitle>
                                <DialogDescription>
                                  {doc.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="h-[400px] bg-muted rounded-md flex items-center justify-center">
                                <FileText className="h-16 w-16 text-muted-foreground/50" />
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">Aucun document trouvé</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Ajoutez votre premier document ou modifiez vos filtres.
                        </p>
                        <Button className="mt-4">
                          <Upload className="mr-2 h-4 w-4" />
                          Ajouter un document
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </PageTransition>
    </>
  );
};

export default Documents;
