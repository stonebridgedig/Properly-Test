
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import type { Announcement, MaintenanceRequest, Tenant, RentRollItem, Property, Owner, CapitalProject, Transaction, ExpenseLog, Vendor, Document, Conversation, Message, Notification, LeaseTemplate, Account, Integration, IntegrationName, ScreeningInfo } from '../types';
import { 
  allAnnouncements as initialAnnouncements, 
  allMaintenanceRequests as initialMaintenanceRequests,
  allTenants as initialTenants,
  rentRollData as initialRentRollData,
  properties as initialProperties,
  allOwners as initialOwners,
  capitalProjects as initialCapitalProjects,
  initialTransactions,
  initialVendors,
  initialDocuments,
  initialConversations,
  initialMessages,
  notifications as initialNotifications,
  initialLeaseTemplates,
  initialChartOfAccounts,
  initialIntegrations,
} from '../constants';

interface DataContextType {
  announcements: Announcement[];
  saveAnnouncement: (announcement: Announcement) => void;
  deleteAnnouncement: (id: string) => void;
  togglePin: (id: string) => void;
  maintenanceRequests: MaintenanceRequest[];
  addMaintenanceRequest: (request: MaintenanceRequest) => void;
  updateMaintenanceRequest: (updatedRequest: MaintenanceRequest) => void;
  tenants: Tenant[];
  addTenant: (tenant: Tenant) => void;
  updateTenant: (updatedTenant: Tenant) => void;
  updateTenantRentPortion: (tenantId: string, newRentPortion: number) => void;
  updateTenantScreening: (tenantId: string, screening: ScreeningInfo) => void;
  deleteTenants: (tenantIds: string[]) => void;
  sendLease: (tenantId: string, leaseData: { templateId: string, startDate: string, endDate: string, rent: number, deposit: number }) => void;
  rentRoll: RentRollItem[];
  logPayment: (rentRollId: string) => void;
  properties: Property[];
  addProperty: (property: Property) => void;
  updateProperty: (updatedProperty: Property, originalName: string) => void;
  deleteProperties: (propertyNames: string[]) => void;
  assignOwnerToProperties: (propertyNames: string[], ownerName: string) => void;
  owners: Owner[];
  addOwner: (ownerData: Omit<Owner, 'id'>) => void;
  deleteOwners: (ownerIds: string[]) => void;
  capitalProjects: CapitalProject[];
  addCapitalProject: (project: CapitalProject) => void;
  updateCapitalProject: (updatedProject: CapitalProject) => void;
  deleteCapitalProjects: (projectNames: string[]) => void;
  bulkUpdateCapitalProjectStatus: (projectNames: string[], status: CapitalProject['status']) => void;
  transactions: Transaction[];
  addTransaction: (transactionData: Omit<Transaction, 'id' | 'owner'>) => void;
  vendors: Vendor[];
  addVendor: (vendor: Vendor) => void;
  updateVendor: (updatedVendor: Vendor) => void;
  documents: Document[];
  addDocument: (document: Document) => void;
  addFolder: (folder: Document) => void;
  deleteDocument: (id: string) => void;
  conversations: Conversation[];
  messages: Message[];
  sendMessage: (message: Message) => void;
  createConversation: (convo: Conversation) => void;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  leaseTemplates: LeaseTemplate[];
  saveLeaseTemplate: (template: { id?: string, name: string, content: string }) => void;
  deleteLeaseTemplate: (id: string) => void;
  setDefaultLeaseTemplate: (id: string) => void;
  chartOfAccounts: Account[];
  saveAccount: (account: Omit<Account, 'id'>, id?: string) => void;
  deleteAccount: (id: string) => void;
  integrations: Integration[];
  toggleIntegration: (name: IntegrationName) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(initialMaintenanceRequests);
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [rentRoll, setRentRoll] = useState<RentRollItem[]>(initialRentRollData);
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [owners, setOwners] = useState<Owner[]>(initialOwners);
  const [capitalProjects, setCapitalProjects] = useState<CapitalProject[]>(initialCapitalProjects);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [leaseTemplates, setLeaseTemplates] = useState<LeaseTemplate[]>(initialLeaseTemplates);
  const [chartOfAccounts, setChartOfAccounts] = useState<Account[]>(initialChartOfAccounts);
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    setRentRoll(prevRentRoll => {
        return prevRentRoll.map(item => {
            // Don't change already paid items
            if (item.status === 'Paid') {
                return item;
            }

            const dueDate = new Date(item.dueDate);
            dueDate.setHours(0, 0, 0, 0); // Normalize to start of day

            if (dueDate < today) {
                return { ...item, status: 'Overdue', balance: item.rent };
            } else {
                return { ...item, status: 'Upcoming', balance: 0 };
            }
        });
    });
  }, []); // Run once on mount

  const addTransaction = useCallback((transactionData: Omit<Transaction, 'id' | 'owner'>) => {
    const property = properties.find(p => p.name === transactionData.property);
    if (!property) return;

    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      owner: property.owner,
      ...transactionData,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, [properties]);

  const saveAnnouncement = useCallback((announcement: Announcement) => {
    setAnnouncements(prev => {
      const index = prev.findIndex(a => a.id === announcement.id);
      if (index > -1) {
        const newAnnouncements = [...prev];
        newAnnouncements[index] = announcement;
        return newAnnouncements;
      } else {
        return [announcement, ...prev];
      }
    });
  }, []);

  const deleteAnnouncement = useCallback((id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  }, []);

  const togglePin = useCallback((id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a));
  }, []);

  const addMaintenanceRequest = useCallback((request: MaintenanceRequest) => {
    setMaintenanceRequests(prev => [request, ...prev]);
  }, []);

  const updateMaintenanceRequest = useCallback((updatedRequest: MaintenanceRequest) => {
    setMaintenanceRequests(prev => prev.map(req => req.id === updatedRequest.id ? updatedRequest : req));
  }, []);
  
  const addTenant = useCallback((tenant: Tenant) => {
    setTenants(prev => [tenant, ...prev]);
  }, []);

  const updateTenant = useCallback((updatedTenant: Tenant) => {
    setTenants(prev => prev.map(t => t.id === updatedTenant.id ? updatedTenant : t));
  }, []);

  const updateTenantRentPortion = useCallback((tenantId: string, newRentPortion: number) => {
    const tenantToUpdate = tenants.find(t => t.id === tenantId);
    if (!tenantToUpdate) return;

    setProperties(prevProperties => {
        return prevProperties.map(prop => {
            if (prop.name !== tenantToUpdate.propertyName) {
                return prop;
            }
            return {
                ...prop,
                buildings: prop.buildings.map(b => ({
                    ...b,
                    units: b.units.map(u => {
                        if (u.name !== tenantToUpdate.unitName) {
                            return u;
                        }
                        return {
                            ...u,
                            tenants: u.tenants.map(tInUnit => {
                                if (tInUnit.name === tenantToUpdate.name) {
                                    return { ...tInUnit, rentPortion: newRentPortion };
                                }
                                return tInUnit;
                            })
                        };
                    })
                }))
            };
        });
    });
  }, [tenants]);

  const updateTenantScreening = useCallback((tenantId: string, screening: ScreeningInfo) => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, screening } : t));
  }, []);

  const sendLease = useCallback((tenantId: string, leaseData: { templateId: string, startDate: string, endDate: string, rent: number, deposit: number }) => {
      // 1. Update Tenant Status to Active (Simulating signature)
      setTenants(prev => prev.map(t => {
          if (t.id !== tenantId) return t;
          return {
              ...t,
              status: 'Active',
              leaseType: 'Fixed',
              leaseEndDate: leaseData.endDate,
              rentStatus: 'Paid' // Assume they pay deposit/first month
          };
      }));

      // 2. Add a Lease Document
      const tenant = tenants.find(t => t.id === tenantId);
      if (tenant) {
          const newDoc: Document = {
              id: `lease-${Date.now()}`,
              name: `Lease Agreement - ${tenant.name}.pdf`,
              type: 'Lease',
              property: tenant.propertyName,
              unit: tenant.unitName,
              path: `/${tenant.propertyName}/Leases/`,
              size: '1.4 MB',
              uploadDate: new Date().toISOString(),
          };
          setDocuments(prev => [newDoc, ...prev]);

          // 3. Update Unit Occupancy
          setProperties(prev => prev.map(prop => {
              if (prop.name !== tenant.propertyName) return prop;
              return {
                  ...prop,
                  buildings: prop.buildings.map(b => ({
                      ...b,
                      units: b.units.map(u => {
                          if (u.name !== tenant.unitName) return u;
                          // Add tenant to unit if not already there
                          const exists = u.tenants.some(t => t.name === tenant.name);
                          if (exists) return u;
                          return {
                              ...u,
                              status: 'Occupied',
                              tenants: [...u.tenants, { name: tenant.name, rentPortion: leaseData.rent }]
                          };
                      })
                  }))
              };
          }));
      }
  }, [tenants]);

  const deleteTenants = useCallback((tenantIds: string[]) => {
    const idsToDelete = new Set(tenantIds);
    if (idsToDelete.size === 0) return;

    const tenantsToDelete = tenants.filter(t => idsToDelete.has(t.id));
    const tenantNamesToDelete = new Set(tenantsToDelete.map(t => t.name));
    const convoIdsToDelete = new Set(
        conversations
            .filter(c => c.participantType === 'Tenant' && idsToDelete.has(c.participantId))
            .map(c => c.id)
    );

    setTenants(prev => prev.filter(t => !idsToDelete.has(t.id)));

    setProperties(prev => prev.map(prop => ({
        ...prop,
        buildings: prop.buildings.map(b => ({
            ...b,
            units: b.units.map(u => {
                const newTenantsInUnit = u.tenants.filter(t => !tenantNamesToDelete.has(t.name));
                if (newTenantsInUnit.length === u.tenants.length) return u;
                return {
                    ...u,
                    tenants: newTenantsInUnit,
                    status: newTenantsInUnit.length === 0 ? 'Vacant' as const : 'Occupied' as const,
                };
            })
        }))
    })));

    setRentRoll(prev => prev.filter(item => !idsToDelete.has(item.id.split('-')[1])));
    setMaintenanceRequests(prev => prev.filter(req => !tenantNamesToDelete.has(req.tenant)));
    setConversations(prev => prev.filter(c => !convoIdsToDelete.has(c.id)));
    setMessages(prev => prev.filter(msg => !convoIdsToDelete.has(msg.conversationId)));
  }, [tenants, conversations, properties, rentRoll, maintenanceRequests, messages]);

  const logPayment = useCallback((rentRollId: string) => {
    let paidItem: RentRollItem | undefined;
    setRentRoll(prev => prev.map(item => {
        if (item.id === rentRollId) {
            paidItem = { ...item, status: 'Paid', balance: 0, paidDate: new Date().toISOString() };
            return paidItem;
        }
        return item;
    }));

    if (paidItem) {
        addTransaction({
            date: new Date().toISOString(),
            description: `Rent - ${paidItem.propertyName}, ${paidItem.unitName}`,
            property: paidItem.propertyName,
            category: 'Income',
            type: 'Rent',
            amount: paidItem.rent,
        });
    }
  }, [addTransaction]);
  
  const addProperty = useCallback((property: Property) => {
    setProperties(prev => [property, ...prev]);
  }, []);

  const updateProperty = useCallback((updatedProperty: Property, originalName: string) => {
      setProperties(prev => prev.map(p => p.name === originalName ? updatedProperty : p));

      if (updatedProperty.name !== originalName) {
        const cascadeNameUpdate = (items: any[], propKey: string) => items.map(item =>
            item[propKey] === originalName ? { ...item, [propKey]: updatedProperty.name } : item
        );
        setTenants(prev => cascadeNameUpdate(prev, 'propertyName'));
        setMaintenanceRequests(prev => cascadeNameUpdate(prev, 'property'));
        setCapitalProjects(prev => cascadeNameUpdate(prev, 'property'));
        setTransactions(prev => cascadeNameUpdate(prev, 'property'));
        setRentRoll(prev => cascadeNameUpdate(prev, 'propertyName'));
        setDocuments(prev => prev.map(doc => {
            if (doc.property === originalName) {
                const newPath = doc.path.replace(`/${originalName}/`, `/${updatedProperty.name}/`);
                return { ...doc, property: updatedProperty.name, path: newPath };
            }
            return doc;
        }));
      }
  }, []);

  const deleteProperties = useCallback((propertyNames: string[]) => {
    const namesSet = new Set(propertyNames);
    setProperties(prev => prev.filter(p => !namesSet.has(p.name)));
    setTenants(prev => prev.filter(t => !namesSet.has(t.propertyName)));
    setMaintenanceRequests(prev => prev.filter(mr => !namesSet.has(mr.property)));
    setCapitalProjects(prev => prev.filter(cp => !namesSet.has(cp.property)));
    setTransactions(prev => prev.filter(t => !namesSet.has(t.property)));
    setRentRoll(prev => prev.filter(rr => !namesSet.has(rr.propertyName)));
    setDocuments(prev => prev.filter(doc => !namesSet.has(doc.property)));
  }, []);

  const assignOwnerToProperties = useCallback((propertyNames: string[], ownerName: string) => {
    const namesSet = new Set(propertyNames);
    setProperties(prev => prev.map(p => namesSet.has(p.name) ? { ...p, owner: ownerName } : p));
  }, []);

  const addOwner = useCallback((ownerData: Omit<Owner, 'id'>) => {
    const newOwner: Owner = {
      id: `o${Date.now()}`,
      ...ownerData,
    };
    setOwners(prev => [...prev, newOwner]);

    if (ownerData.properties && ownerData.properties.length > 0) {
      assignOwnerToProperties(ownerData.properties, newOwner.name);
    }
  }, [assignOwnerToProperties]);

  const deleteOwners = useCallback((ownerIds: string[]) => {
    const idsToDelete = new Set(ownerIds);
    if (idsToDelete.size === 0) return;

    const ownersToDelete = owners.filter(o => idsToDelete.has(o.id));
    const namesToDelete = new Set(ownersToDelete.map(o => o.name));
    const convoIdsToDelete = new Set(
        conversations
            .filter(c => c.participantType === 'Owner' && idsToDelete.has(c.participantId))
            .map(c => c.id)
    );

    setOwners(prev => prev.filter(o => !idsToDelete.has(o.id)));
    setProperties(prev => prev.map(p =>
        namesToDelete.has(p.owner) ? { ...p, owner: '' } : p
    ));
    setConversations(prev => prev.filter(c => !convoIdsToDelete.has(c.id)));
    setMessages(prev => prev.filter(msg => !convoIdsToDelete.has(msg.conversationId)));
  }, [owners, conversations, properties, messages]);

  const addCapitalProject = useCallback((project: CapitalProject) => {
    setCapitalProjects(prev => [project, ...prev]);
  }, []);

  const updateCapitalProject = useCallback((updatedProject: CapitalProject) => {
    setCapitalProjects(prev => prev.map(p => p.name === updatedProject.name && p.property === updatedProject.property ? updatedProject : p));
  }, []);

  const deleteCapitalProjects = useCallback((projectNames: string[]) => {
    const namesSet = new Set(projectNames);
    setCapitalProjects(prev => prev.filter(p => !namesSet.has(p.name)));
  }, []);
  
  const bulkUpdateCapitalProjectStatus = useCallback((projectNames: string[], status: CapitalProject['status']) => {
    const namesSet = new Set(projectNames);
    setCapitalProjects(prev => prev.map(p => 
        namesSet.has(p.name) ? { ...p, status } : p
    ));
  }, []);
  
  const addVendor = useCallback((vendor: Vendor) => {
    setVendors(prev => [vendor, ...prev]);
  }, []);

  const updateVendor = useCallback((updatedVendor: Vendor) => {
    setVendors(prev => prev.map(v => v.id === updatedVendor.id ? updatedVendor : v));
  }, []);

  const addDocument = useCallback((document: Document) => {
    setDocuments(prev => [document, ...prev]);
  }, []);

  const addFolder = useCallback((folder: Document) => {
    setDocuments(prev => [folder, ...prev]);
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => {
        const docToDelete = prev.find(d => d.id === id);
        if (!docToDelete) return prev;

        if (docToDelete.type !== 'Folder') {
            return prev.filter(d => d.id !== id);
        }

        // It's a folder, find all descendants to delete
        const idsToDelete = new Set<string>([id]);
        const queue: string[] = [`${docToDelete.path}${docToDelete.name}/`];

        while (queue.length > 0) {
            const currentPath = queue.shift()!;
            const children = prev.filter(d => d.path === currentPath);
            children.forEach(child => {
                idsToDelete.add(child.id);
                if (child.type === 'Folder') {
                    queue.push(`${child.path}${child.name}/`);
                }
            });
        }

        return prev.filter(doc => !idsToDelete.has(doc.id));
    });
  }, []);

  const sendMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
    setConversations(prev => prev.map(c => 
      c.id === message.conversationId 
        ? { ...c, lastMessage: message.text, lastMessageTimestamp: message.timestamp } 
        : c
    ));
  }, []);

  const createConversation = useCallback((convo: Conversation) => {
    setConversations(prev => {
        // Check if it already exists (by ID or by context)
        const exists = prev.some(c => c.id === convo.id || (convo.contextId && c.contextId === convo.contextId));
        if (exists) return prev;
        return [...prev, convo];
    });
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const saveLeaseTemplate = useCallback((template: { id?: string, name: string, content: string }) => {
    setLeaseTemplates(prev => {
        const id = template.id || `ltpl_${Date.now()}`;
        const index = prev.findIndex(t => t.id === id);
        if (index > -1) {
            const newTemplates = [...prev];
            newTemplates[index] = { ...newTemplates[index], name: template.name, content: template.content };
            return newTemplates;
        } else {
            const newTemplate: LeaseTemplate = {
                id,
                name: template.name,
                content: template.content,
                isDefault: prev.length === 0, // First template is default
            };
            return [newTemplate, ...prev];
        }
    });
  }, []);

  const deleteLeaseTemplate = useCallback((id: string) => {
    setLeaseTemplates(prev => prev.filter(t => t.id !== id));
  }, []);
  
  const setDefaultLeaseTemplate = useCallback((id: string) => {
    setLeaseTemplates(prev => prev.map(t => ({ ...t, isDefault: t.id === id })));
  }, []);

  const saveAccount = useCallback((accountData: Omit<Account, 'id'>, id?: string) => {
    setChartOfAccounts(prev => {
        if (id) { // Edit
            return prev.map(acc => acc.id === id ? { ...acc, ...accountData } : acc);
        } else { // Add
            const newAccount: Account = {
                id: `acc_${Date.now()}`,
                ...accountData,
            };
            return [...prev, newAccount];
        }
    });
  }, []);

  const deleteAccount = useCallback((id: string) => {
    setChartOfAccounts(prev => prev.filter(acc => acc.id !== id));
  }, []);

  const toggleIntegration = useCallback((name: IntegrationName) => {
    setIntegrations(prev => prev.map(integ => 
        integ.name === name ? { ...integ, connected: !integ.connected } : integ
    ));
  }, []);

  const value = useMemo(() => ({
    announcements,
    saveAnnouncement,
    deleteAnnouncement,
    togglePin,
    maintenanceRequests,
    addMaintenanceRequest,
    updateMaintenanceRequest,
    tenants,
    addTenant,
    updateTenant,
    updateTenantRentPortion,
    updateTenantScreening,
    deleteTenants,
    sendLease,
    rentRoll,
    logPayment,
    properties,
    addProperty,
    updateProperty,
    deleteProperties,
    assignOwnerToProperties,
    owners,
    addOwner,
    deleteOwners,
    capitalProjects,
    addCapitalProject,
    updateCapitalProject,
    deleteCapitalProjects,
    bulkUpdateCapitalProjectStatus,
    transactions,
    addTransaction,
    vendors,
    addVendor,
    updateVendor,
    documents,
    addDocument,
    addFolder,
    deleteDocument,
    conversations,
    messages,
    sendMessage,
    createConversation,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    leaseTemplates, 
    saveLeaseTemplate, 
    deleteLeaseTemplate, 
    setDefaultLeaseTemplate,
    chartOfAccounts,
    saveAccount,
    deleteAccount,
    integrations,
    toggleIntegration,
  }), [
    announcements, saveAnnouncement, deleteAnnouncement, togglePin,
    maintenanceRequests, addMaintenanceRequest, updateMaintenanceRequest,
    tenants, addTenant, updateTenant, updateTenantRentPortion, updateTenantScreening, deleteTenants, sendLease,
    rentRoll, logPayment,
    properties, addProperty, updateProperty, deleteProperties, assignOwnerToProperties,
    owners, addOwner, deleteOwners,
    capitalProjects, addCapitalProject, updateCapitalProject, deleteCapitalProjects, bulkUpdateCapitalProjectStatus,
    transactions, addTransaction,
    vendors, addVendor, updateVendor,
    documents, addDocument, addFolder, deleteDocument,
    conversations, messages, sendMessage, createConversation,
    notifications, markNotificationAsRead, markAllNotificationsAsRead,
    leaseTemplates, saveLeaseTemplate, deleteLeaseTemplate, setDefaultLeaseTemplate,
    chartOfAccounts, saveAccount, deleteAccount,
    integrations, toggleIntegration,
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
