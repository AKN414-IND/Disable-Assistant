import React, { useState, useEffect, useMemo } from 'react';
import { database } from '../Firebase';  
import { ref, onValue } from 'firebase/database';
import './ContactProfessionals.css';

const ContactProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    specialty: 'all',
    sortOrder: 'asc' // 'asc' or 'desc'
  });

  // Fetch professionals data
  useEffect(() => {
    const professionalsRef = ref(database, 'professionals');

    const unsubscribe = onValue(professionalsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const professionalsArray = Object.entries(data).map(([id, professional]) => ({
            id,
            ...professional
          }));
          setProfessionals(professionalsArray);
        } else {
          setProfessionals([]);
        }
        setLoading(false);
      } catch (err) {
        setError('Error loading professionals');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Get unique specialties
  const specialties = useMemo(() => {
    const specialtySet = new Set();
    professionals.forEach(professional => {
      if (professional.specialties && Array.isArray(professional.specialties)) {
        professional.specialties.forEach(specialty => {
          specialtySet.add(specialty.trim());
        });
      }
    });
    return Array.from(specialtySet).sort();
  }, [professionals]);

  // Filter and sort professionals
  const filteredProfessionals = useMemo(() => {
    let filtered = [...professionals];

    try {
      // Apply specialty filter
      if (filters.specialty !== 'all') {
        filtered = filtered.filter(professional => 
          professional.specialties && 
          Array.isArray(professional.specialties) &&
          professional.specialties.some(specialty => 
            specialty.trim().toLowerCase() === filters.specialty.toLowerCase()
          )
        );
      }

      // Sort by name
      filtered.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase().trim();
        const nameB = (b.name || '').toLowerCase().trim();
        const comparison = nameA.localeCompare(nameB);
        return filters.sortOrder === 'asc' ? comparison : -comparison;
      });

      return filtered;
    } catch (err) {
      console.error('Error filtering professionals:', err);
      return professionals;
    }
  }, [professionals, filters]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  if (loading) return <div className="loading">Loading professionals...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="professionals-page">
      <div className="container">
        <h1>Contact Professionals</h1>
        <p className="subtitle">Connect with our healthcare professionals</p>

        <div className="filters-container">
          {/* Specialty Filter */}
          <div className="filter-group">
            <label htmlFor="specialty">Specialty</label>
            <select
              id="specialty"
              className="filter-select"
              value={filters.specialty}
              onChange={(e) => handleFilterChange('specialty', e.target.value)}
            >
              <option value="all">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="filter-group">
            <label htmlFor="sortOrder">Sort by Name</label>
            <select
              id="sortOrder"
              className="filter-select"
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            >
              <option value="asc">A to Z</option>
              <option value="desc">Z to A</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-count">
          Found {filteredProfessionals.length} professionals
        </div>

        <div className="professionals-grid">
          {filteredProfessionals.map((professional) => (
            <div key={professional.id} className="professional-card">
              <div className="professional-info">
                <h3>{professional.name}</h3>
                <p className="designation">{professional.designation}</p>
                
                {professional.specialties && (
                  <div className="specialties">
                    {professional.specialties.map(specialty => (
                      <span key={specialty} className="specialty-tag">
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}

                <div className="contact-buttons">
                  <button 
                    onClick={() => window.open(`https://wa.me/${professional.whatsapp}`, '_blank')}
                    className="whatsapp-button contact-button"
                    aria-label={`Contact ${professional.name} via WhatsApp`}
                  >
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => window.open(`mailto:${professional.email}`, '_blank')}
                    className="email-button contact-button"
                    aria-label={`Contact ${professional.name} via Email`}
                  >
                    Email
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
          <div className="no-results">
            <p>No professionals found for this specialty.</p>
            <button 
              className="reset-filters"
              onClick={() => setFilters({
                specialty: 'all',
                sortOrder: 'asc'
              })}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactProfessionals;