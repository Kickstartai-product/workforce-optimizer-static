import json
import random
from itertools import product

def generate_test_data(job_names):
    # Assign IDs to job names
    job_lookup = {i: name for i, name in enumerate(job_names)}
    
    # Create reverse lookup for generating data
    id_lookup = {name: i for i, name in job_lookup.items()}
    
    # Define all possible settings combinations
    productivity_rates = [0.5, 1.0, 1.5]
    steering_options = ['with', 'without']
    work_hours = ['everyone', 'part-time', 'healthcare']
    job_priorities = ['standard', 'defense', 'healthcare', 'infrastructure']
    non_source_jobs = ['standard', 'ambitious-and-education', 'ambitious-only']
    
    # Generate results for all combinations
    results = {}
    for prod, steer, hours, priority, non_source in product(
        productivity_rates, steering_options, work_hours, 
        job_priorities, non_source_jobs
    ):
        # Create settings key
        key = f"{prod}-{steer}-{hours}-{priority}-{non_source}"
        
        # Generate random shortages
        shortages = []
        for _ in range(random.randint(5, 10)):
            job_id = random.randint(0, len(job_names) - 1)
            shortage = random.randint(100, 1000)
            shortages.append({
                "jobId": job_id,
                "shortage": shortage
            })
        
        # Generate random transitions
        transitions = []
        for _ in range(10):
            source_id = random.randint(0, len(job_names) - 1)
            target_id = random.randint(0, len(job_names) - 1)
            amount = random.randint(50, 500)
            transitions.append({
                "sourceJobId": source_id,
                "targetJobId": target_id,
                "amount": amount
            })
        
        # Store results
        results[key] = {
            "remainingShortages": shortages,
            "topTransitions": transitions
        }
    
    return job_lookup, results

def main():
    # Example job names (replace with your actual list)
    job_names = ['Accountants',
    'Adviseurs marketing, public relations en sales',
    'Algemeen directeuren',
    'Apothekersassistenten',
    'Architecten',
    'Artsen',
    'Assemblagemedewerkers',
    'Auteurs en taalkundigen',
    'Automonteurs',
    'Bakkers',
    'Bedieners mobiele machines',
    'Bedrijfskundigen en organisatieadviseurs',
    'Beeldend kunstenaars',
    'Beleidsadviseurs',
    'Beroepsgroep sportinstructeurs',
    'Beveiligingspersoneel',
    'Bibliothecarissen en conservatoren',
    'Biologen en natuurwetenschappers',
    'Boekhouders',
    'Boekhoudkundig medewerkers',
    'Bouwarbeiders afbouw',
    'Bouwarbeiders ruwbouw',
    'Buschauffeurs en trambestuurders',
    'Callcentermedewerkers outbound en overige verkopers',
    "Chauffeurs auto's, taxi's en bestelwagens",
    'Conciërges en teamleiders schoonmaak',
    'Databank- en netwerkspecialisten',
    'Dekofficieren en piloten',
    'Directiesecretaresses',
    'Docenten algemene vakken secundair onderwijs',
    'Docenten beroepsgerichte vakken secundair onderwijs',
    'Docenten hoger onderwijs en hoogleraren',
    'Elektriciens en elektronicamonteurs',
    'Elektrotechnisch ingenieurs',
    'Financieel specialisten en economen',
    'Fotografen en interieurontwerpers',
    'Fysiotherapeuten',
    'Gebruikersondersteuning ICT',
    'Gespecialiseerd verpleegkundigen',
    'Grafisch vormgevers en productontwerpers',
    'Hoveniers, tuinders en kwekers',
    'Hulpkrachten bouw en industrie',
    'Hulpkrachten landbouw',
    'Ingenieurs (geen elektrotechniek)',
    'Journalisten',
    'Juristen',
    'Kappers en schoonheidsspecialisten',
    'Kassamedewerkers',
    'Kelners en barpersoneel',
    'Keukenhulpen',
    'Koks',
    'Laboranten',
    'Laders, lossers en vakkenvullers',
    'Land- en bosbouwers',
    'Lassers en plaatwerkers',
    'Leerkrachten basisonderwijs',
    'Leidsters kinderopvang en onderwijsassistenten',
    'Loodgieters en pijpfitters',
    'Maatschappelijk werkers',
    'Machinemonteurs',
    'Managers ICT',
    'Managers commerciële en persoonlijke dienstverlening',
    'Managers detail- en groothandel',
    'Managers gespecialiseerde dienstverlening',
    'Managers horeca',
    'Managers logistiek',
    'Managers onderwijs',
    'Managers productie',
    'Managers verkoop en marketing',
    'Managers zakelijke en administratieve dienstverlening',
    'Managers zonder specificatie',
    'Managers zorginstellingen',
    'Medewerkers drukkerij en kunstnijverheid',
    'Medisch praktijkassistenten',
    'Medisch vakspecialisten',
    'Metaalbewerkers en constructiewerkers',
    'Meubelmakers, kleermakers en stoffeerders',
    'Militairen',
    'Onderwijskundigen en overige docenten',
    'Overheidsambtenaren',
    'Overheidsbestuurders',
    'Politie en brandweer',
    'Politie-inspecteurs',
    'Procesoperators',
    'Productcontroleurs',
    'Productieleiders industrie en bouw',
    'Productiemachinebedieners',
    'Psychologen en sociologen',
    'Radio- en televisietechnici',
    'Receptionisten en telefonisten',
    'Reisbegeleiders',
    'Schilders en metaalspuiters',
    'Schoonmakers',
    'Secretaresses en administratief medewerkers',
    'Slagers',
    'Sociaal werkers, groeps- en woonbegeleiders',
    'Software- en applicatieontwikkelaars',
    'Specialisten personeels- en loopbaanontwikkeling',
    'Technici bouwkunde en natuur',
    'Timmerlieden',
    'Transportplanners en logistiek medewerkers',
    'Uitvoerend kunstenaars',
    'Veetelers',
    'Verkoopmedewerkers detailhandel',
    'Verpleegkundigen (mbo)',
    'Vertegenwoordigers en inkopers',
    'Verzorgenden en verleners van overige persoonlijke diensten',
    'Vrachtwagenchauffeurs',
    'Vuilnisophalers en dagbladenbezorgers',
    'Winkeliers en teamleiders detailhandel',
    'Zakelijke dienstverleners']
    
    # Generate data
    job_lookup, results = generate_test_data(job_names)
    
    # Save to JSON files
    with open('job-names.json', 'w', encoding='utf-8') as f:
        json.dump(job_lookup, f, ensure_ascii=False, indent=2)
    
    with open('model-results.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()