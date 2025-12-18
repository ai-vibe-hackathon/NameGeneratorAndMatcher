import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Search, RefreshCw, Wand2, Leaf, Crown, BookOpen, Hourglass, Feather, Star, Smile, Flower2, Palette, User, Users } from 'lucide-react';
import NameCard from './components/NameCard';
import HarmonyMeter from './components/HarmonyMeter';

function App() {
    const [activeTab, setActiveTab] = useState('generator');
    const [generatorType, setGeneratorType] = useState('english'); // 'english' or 'chinese'
    const [useAI, setUseAI] = useState(false);
    const [names, setNames] = useState([]);
    const [filters, setFilters] = useState({
        gender: '',
        origin: '',
        search: '',
        theme: '',
        length: '',
        firstLetter: ''
    });
    const [matchInput, setMatchInput] = useState({ name1: '', name2: '' });
    const [matchResult, setMatchResult] = useState(null);
    const [teamInput, setTeamInput] = useState({ keywords: '', vibe: '' });
    const [teamNames, setTeamNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const resultsRef = useRef(null);

    // Fetch names
    useEffect(() => {
        fetchNames();
    }, [filters, generatorType]); // Removed useAI from dependencies

    const fetchNames = async () => {
        setLoading(true);
        setError(null);
        try {
            let url = 'http://localhost:3000/api/names';
            let options = {};

            if (useAI) {
                url = 'http://localhost:3000/api/generate';
                options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(filters)
                };
            } else {
                const params = new URLSearchParams();
                if (filters.gender) params.append('gender', filters.gender);
                if (filters.origin) params.append('origin', filters.origin);
                if (filters.search) params.append('search', filters.search);
                if (filters.theme) params.append('theme', filters.theme);
                if (filters.length) params.append('length', filters.length);
                if (filters.firstLetter) params.append('firstLetter', filters.firstLetter);
                url = `${url}?${params.toString()}`;
            }

            const response = await fetch(url, options);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch names');
            }

            if (Array.isArray(data)) {
                setNames(data);
                setCurrentPage(1); // Reset to first page on new search
            } else {
                throw new Error('Invalid data format received');
            }


        } catch (error) {
            console.error('Error fetching names:', error);
            setError(error.message);
            // Keep previous names if AI fails, or clear? Let's clear to avoid confusion if it's a new search
            if (useAI) setNames([]);
        } finally {
            setLoading(false);
        }
    };

    // Refetch when generator type changes
    useEffect(() => {
        fetchNames();
    }, [generatorType]);

    const handleMatch = async (e) => {
        e.preventDefault();
        if (!matchInput.name1 || !matchInput.name2) return;

        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(matchInput)
            });
            const data = await res.json();
            setMatchResult(data);
        } catch (err) {
            console.error("Failed to match", err);
        } finally {
            setLoading(false);
        }
    };

    const handleTeamGenerate = async (e) => {
        e.preventDefault();
        if (!teamInput.keywords) return;

        setLoading(true);
        setTeamNames([]);
        try {
            const res = await fetch('http://localhost:3000/api/team-names', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(teamInput)
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setTeamNames(data);
            }
        } catch (err) {
            console.error("Failed to generate team names", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <header style={{ textAlign: 'center', padding: '4rem 0 2rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Name Generator and Matcher
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
                        Discover the perfect name or find your cosmic connection.
                    </p>
                </motion.div>
            </header>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <button
                    className={`glass-panel ${activeTab === 'generator' ? 'active' : ''}`}
                    onClick={() => setActiveTab('generator')}
                    style={{
                        padding: '1rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: activeTab === 'generator' ? 'rgba(255,255,255,0.15)' : 'transparent',
                        color: activeTab === 'generator' ? 'var(--color-primary)' : 'var(--color-text)'
                    }}
                >
                    <Sparkles size={18} /> Name Generator
                </button>
                <button
                    className={`glass-panel ${activeTab === 'match' ? 'active' : ''}`}
                    onClick={() => setActiveTab('match')}
                    style={{
                        padding: '1rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: activeTab === 'match' ? 'rgba(255,255,255,0.15)' : 'transparent',
                        color: activeTab === 'match' ? 'var(--color-secondary)' : 'var(--color-text)'
                    }}
                >
                    <Heart size={18} /> Name Matcher
                </button>
                <button
                    className={`glass-panel ${activeTab === 'team' ? 'active' : ''}`}
                    onClick={() => setActiveTab('team')}
                    style={{
                        padding: '1rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: activeTab === 'team' ? 'rgba(255,255,255,0.15)' : 'transparent',
                        color: activeTab === 'team' ? 'var(--color-accent)' : 'var(--color-text)'
                    }}
                >
                    <Users size={18} /> Team Name Generator
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'generator' ? (
                    <motion.div
                        key="generator"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Sub-tabs for English / Chinese */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem' }}>
                            <button
                                onClick={() => {
                                    setGeneratorType('english');
                                    setFilters(prev => ({ ...prev, origin: '' }));
                                }}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '20px',
                                    background: generatorType === 'english' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                    color: generatorType === 'english' ? '#000' : '#fff',
                                    fontWeight: '600'
                                }}
                            >
                                English Names
                            </button>
                            <button
                                onClick={() => {
                                    setGeneratorType('chinese');
                                    setFilters(prev => ({ ...prev, origin: 'Chinese' }));
                                }}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '20px',
                                    background: generatorType === 'chinese' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                    color: generatorType === 'chinese' ? '#000' : '#fff',
                                    fontWeight: '600'
                                }}
                            >
                                Chinese Names
                            </button>
                        </div>



                        {(generatorType === 'english' || generatorType === 'chinese') && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>

                                {/* Gender Section */}
                                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                                        <span style={{ color: 'var(--color-accent)' }}>1.</span> Select Gender
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                        {['Female', 'Male', ''].map(g => (
                                            <button
                                                key={g || 'all'}
                                                onClick={() => setFilters({ ...filters, gender: g.toLowerCase() })}
                                                style={{
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    border: '1px solid var(--glass-border)',
                                                    background: filters.gender === g.toLowerCase() ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                                                    color: filters.gender === g.toLowerCase() ? '#000' : '#fff',
                                                    fontWeight: '600',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {g || 'All Genders'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Theme Section */}
                                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                                        <span style={{ color: 'var(--color-accent)' }}>2.</span> Choose a Theme
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                                        {[
                                            { id: 'All Themes', value: '', icon: <Sparkles size={24} /> },
                                            { id: 'Nature', value: 'Nature', icon: <Leaf size={24} /> },
                                            { id: 'Royal', value: 'Royal', icon: <Crown size={24} /> },
                                            { id: 'Classic', value: 'Classic', icon: <BookOpen size={24} /> },
                                            { id: 'Vintage', value: 'Vintage', icon: <Hourglass size={24} /> },
                                            { id: 'Literature', value: 'Literature', icon: <Feather size={24} /> },
                                            { id: 'Celestial', value: 'Celestial', icon: <Star size={24} /> },
                                            { id: 'Cute', value: 'Cute', icon: <Smile size={24} /> },
                                            { id: 'Flowers', value: 'Flowers', icon: <Flower2 size={24} /> },
                                            { id: 'Color', value: 'Color', icon: <Palette size={24} /> },
                                            { id: 'Unique', value: 'Unique', icon: <Wand2 size={24} /> },
                                            { id: 'Character', value: 'Character', icon: <User size={24} /> },
                                        ].map(theme => (
                                            <button
                                                key={theme.id}
                                                onClick={() => setFilters({ ...filters, theme: theme.value })}
                                                style={{
                                                    padding: '1.5rem 1rem',
                                                    borderRadius: '16px',
                                                    border: '1px solid var(--glass-border)',
                                                    background: filters.theme === theme.value ? 'var(--color-secondary)' : 'rgba(255,255,255,0.05)',
                                                    color: '#fff',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '0.8rem',
                                                    fontSize: '1rem',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {theme.icon}
                                                {theme.id}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Other Filters Section (Collapsible-ish look) */}
                                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                                        <span style={{ color: 'var(--color-accent)' }}>3.</span> Refine Search
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>

                                        {/* Origin - Only show for English */}
                                        {generatorType === 'english' && (
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Origin</label>
                                                <select
                                                    value={filters.origin}
                                                    onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--glass-border)' }}
                                                >
                                                    <option value="">All Origins</option>
                                                    <option value="Latin">Latin</option>
                                                    <option value="Greek">Greek</option>
                                                    <option value="Hebrew">Hebrew</option>
                                                    <option value="German">German</option>
                                                    <option value="French">French</option>
                                                    <option value="English">English</option>
                                                    <option value="Irish">Irish</option>
                                                </select>
                                            </div>
                                        )}

                                        {/* Length */}
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Length</label>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {['short', 'medium', 'long'].map(l => (
                                                    <button
                                                        key={l}
                                                        onClick={() => setFilters({ ...filters, length: filters.length === l ? '' : l })}
                                                        style={{
                                                            flex: 1,
                                                            padding: '10px',
                                                            borderRadius: '8px',
                                                            border: '1px solid var(--glass-border)',
                                                            background: filters.length === l ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                                            color: '#fff',
                                                            fontSize: '0.8rem',
                                                            textTransform: 'capitalize'
                                                        }}
                                                    >
                                                        {l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* First Letter */}
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>First Letter</label>
                                            <input
                                                type="text"
                                                placeholder="A-Z"
                                                maxLength={1}
                                                value={filters.firstLetter}
                                                onChange={(e) => setFilters({ ...filters, firstLetter: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--glass-border)',
                                                    background: 'rgba(0,0,0,0.2)',
                                                    color: '#fff',
                                                    textAlign: 'center',
                                                    textTransform: 'uppercase'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* AI Toggle */}
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <button
                                        onClick={() => setUseAI(!useAI)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.8rem 1.5rem',
                                            borderRadius: '20px',
                                            background: useAI ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' : 'rgba(255,255,255,0.1)',
                                            border: '1px solid var(--glass-border)',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <Sparkles size={18} />
                                        {useAI ? 'AI Generation Enabled' : 'Enable AI Generation'}
                                    </button>
                                </div>

                                {/* Generate Button */}
                                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    <button
                                        className="btn-primary"
                                        onClick={fetchNames} // Explicitly trigger fetch/scroll
                                        style={{ minWidth: '200px', fontSize: '1.2rem' }}
                                        disabled={loading}
                                    >
                                        {loading ? <RefreshCw className="animate-spin" /> : 'Generate'}
                                    </button>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div style={{
                                        marginTop: '1.5rem',
                                        padding: '1rem',
                                        background: 'rgba(255, 0, 0, 0.1)',
                                        border: '1px solid rgba(255, 0, 0, 0.3)',
                                        borderRadius: '12px',
                                        color: '#ffcccc',
                                        textAlign: 'center'
                                    }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Generation Failed</p>
                                        <p style={{ fontSize: '0.9rem' }}>{error}</p>
                                        {useAI && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>Try disabling AI generation or checking your API key.</p>}
                                    </div>
                                )}

                            </div>
                        )}


                        {/* Results Grid */}
                        <div ref={resultsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            {loading ? (
                                // Skeleton Loading State
                                Array.from({ length: 8 }).map((_, index) => (
                                    <div key={`skeleton-${index}`} className="glass-panel" style={{ height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', animation: 'pulse 1.5s infinite ease-in-out' }}>
                                        <div style={{ width: '60%', height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '1rem' }}></div>
                                        <div style={{ width: '40%', height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
                                        <div style={{ width: '80%', height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                                    </div>
                                ))
                            ) : (
                                names.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(name => (
                                    <NameCard key={name.id} {...name} />
                                ))
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {!loading && names.length > itemsPerPage && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                                <button
                                    onClick={() => {
                                        setCurrentPage(p => Math.max(1, p - 1));
                                        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                    disabled={currentPage === 1}
                                    style={{
                                        padding: '0.8rem 1.5rem',
                                        borderRadius: '12px',
                                        background: currentPage === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                                        border: '1px solid var(--glass-border)',
                                        color: currentPage === 1 ? 'var(--color-text-muted)' : '#fff',
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Previous
                                </button>
                                <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-muted)' }}>
                                    Page {currentPage} of {Math.ceil(names.length / itemsPerPage)}
                                </span>
                                <button
                                    onClick={() => {
                                        setCurrentPage(p => Math.min(Math.ceil(names.length / itemsPerPage), p + 1));
                                        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                    disabled={currentPage === Math.ceil(names.length / itemsPerPage)}
                                    style={{
                                        padding: '0.8rem 1.5rem',
                                        borderRadius: '12px',
                                        background: currentPage === Math.ceil(names.length / itemsPerPage) ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                                        border: '1px solid var(--glass-border)',
                                        color: currentPage === Math.ceil(names.length / itemsPerPage) ? 'var(--color-text-muted)' : '#fff',
                                        cursor: currentPage === Math.ceil(names.length / itemsPerPage) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                        {names.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                                No names found matching your criteria.
                            </div>
                        )}
                    </motion.div>
                ) : activeTab === 'match' ? (
                    <motion.div
                        key="match"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{ maxWidth: '600px', margin: '0 auto' }}
                    >
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Name Matcher</h2>
                            <form onSubmit={handleMatch} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>First Name</label>
                                    <input
                                        type="text"
                                        value={matchInput.name1}
                                        onChange={(e) => setMatchInput({ ...matchInput, name1: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', fontSize: '1.1rem' }}
                                        placeholder="e.g. Romeo"
                                    />
                                </div>

                                <div style={{ textAlign: 'center', color: 'var(--color-secondary)' }}>
                                    <Heart size={24} fill="currentColor" />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Second Name</label>
                                    <input
                                        type="text"
                                        value={matchInput.name2}
                                        onChange={(e) => setMatchInput({ ...matchInput, name2: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', fontSize: '1.1rem' }}
                                        placeholder="e.g. Juliet"
                                    />
                                </div>

                                <button type="submit" className="btn-primary" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                    {loading ? <RefreshCw className="animate-spin" /> : <Wand2 size={20} />}
                                    Calculate Matcher Score
                                </button>
                            </form>
                        </div>

                        {matchResult && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring" }}
                            >
                                <HarmonyMeter score={matchResult.score} details={matchResult.details} />
                            </motion.div>
                        )}
                    </motion.div>
                ) : activeTab === 'team' ? (
                    <motion.div
                        key="team"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{ maxWidth: '800px', margin: '0 auto' }}
                    >
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Team Name Generator</h2>
                            <form onSubmit={handleTeamGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Keywords / Description</label>
                                    <input
                                        type="text"
                                        value={teamInput.keywords}
                                        onChange={(e) => setTeamInput({ ...teamInput, keywords: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', fontSize: '1.1rem' }}
                                        placeholder="e.g. coding, speed, future, innovation"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Vibe</label>
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                        {['Professional', 'Creative', 'Edgy', 'Fun', 'Minimalist'].map(v => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => setTeamInput({ ...teamInput, vibe: v })}
                                                style={{
                                                    padding: '0.8rem 1.5rem',
                                                    borderRadius: '20px',
                                                    background: teamInput.vibe === v ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                                                    border: '1px solid var(--glass-border)',
                                                    color: teamInput.vibe === v ? '#000' : '#fff',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                    {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={20} />}
                                    Generate Team Names
                                </button>
                            </form>
                        </div>

                        {teamNames.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                                {teamNames.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="glass-panel"
                                        style={{ padding: '1.5rem', textAlign: 'center' }}
                                    >
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>{item.name}</h3>
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{item.meaning}</p>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div >
    );
}

export default App;
