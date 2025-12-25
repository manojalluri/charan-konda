import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, MessageCircle, RefreshCcw, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const data = await api.get('/contact');
            setContacts(data);
        } catch (err) {
            console.error('Error fetching contacts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchContacts();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredContacts = contacts.filter(contact =>
        !searchQuery ||
        contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.contact?.includes(searchQuery) ||
        contact.phone?.includes(searchQuery) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.requirement?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
                    <p className="text-gray-500 mt-1">View and manage customer inquiries ({contacts.length} total)</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                    <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name, contact, or requirement..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                </div>
            </div>

            {/* Contacts Table */}
            {loading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading contacts...</p>
                </div>
            ) : filteredContacts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contact Submissions</h3>
                    <p className="text-gray-500">
                        {searchQuery
                            ? 'No submissions match your search'
                            : 'Contact form submissions will appear here'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        {/* Desktop View Table */}
                        <table className="w-full hidden md:table">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredContacts.map((contact) => (
                                    <tr key={contact._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(contact.created_at)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mr-3 font-bold">
                                                    {contact.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                {contact.phone && (
                                                    <div className="flex items-center text-sm text-gray-700">
                                                        <Phone size={14} className="mr-2 text-gray-400" />
                                                        {contact.phone}
                                                    </div>
                                                )}
                                                {contact.email && (
                                                    <div className="flex items-center text-sm text-gray-700">
                                                        <Mail size={14} className="mr-2 text-gray-400" />
                                                        {contact.email}
                                                    </div>
                                                )}
                                                {!contact.phone && !contact.email && contact.contact && (
                                                    <div className="flex items-center text-sm text-gray-700">
                                                        {contact.contact.includes('@') ? <Mail size={14} className="mr-2 text-gray-400" /> : <Phone size={14} className="mr-2 text-gray-400" />}
                                                        {contact.contact}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700 max-w-md line-clamp-2">
                                                {contact.requirement}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile View Cards */}
                        <div className="md:hidden divide-y divide-gray-200">
                            {filteredContacts.map((contact) => (
                                <div key={contact._id} className="p-4 bg-white hover:bg-gray-50">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                            {contact.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900">{contact.name}</p>
                                            <p className="text-xs text-gray-500">{formatDate(contact.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mt-2">
                                        <div className="flex flex-col gap-2">
                                            {contact.phone && (
                                                <div className="flex items-center text-sm text-gray-700">
                                                    <Phone size={14} className="mr-2 text-gray-400" />
                                                    {contact.phone}
                                                </div>
                                            )}
                                            {contact.email && (
                                                <div className="flex items-center text-sm text-gray-700">
                                                    <Mail size={14} className="mr-2 text-gray-400" />
                                                    {contact.email}
                                                </div>
                                            )}
                                            {!contact.phone && !contact.email && contact.contact && (
                                                <div className="flex items-center text-sm text-gray-700">
                                                    {contact.contact.includes('@') ? <Mail size={14} className="mr-2 text-gray-400" /> : <Phone size={14} className="mr-2 text-gray-400" />}
                                                    {contact.contact}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1 font-medium">Requirement:</p>
                                            {contact.requirement}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination Info */}
                    <div className="px-6 py-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Showing {filteredContacts.length} of {contacts.length} submissions
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contacts;
